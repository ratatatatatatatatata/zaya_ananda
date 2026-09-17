const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const a = {name:'Багш А'}, b = {name:'Багш Б'};
let uid='student', orders=[], bookings=[];
const course={id:'course',kind:'course',title:'Сургалт',price:500,teachers:[a,b]};
const service={...course,id:'service',kind:'service',bookingDays:[0,1,2,3,4,5,6]};
const repo={
 getCmsById:async id=>id==='course'?course:id==='service'?service:null,
 getCmsByIdCached:async id=>id==='service'?service:null,
 getUserById:async()=>({name:'Test',email:'test@example.com',phone:'99000000'}),
 createOrder:async input=>{const order={id:String(orders.length),status:'pending',...structuredClone(input)};orders.push(order);return order;},
 getOrdersByUser:async user=>orders.filter(order=>order.userId===user),
 findCourse:()=>null,findService:()=>null,findProduct:()=>null,
};
const cache=new Map();
function load(relative){
 const filename=path.resolve(root,relative);if(cache.has(filename))return cache.get(filename).exports;
 const mod={exports:{}};cache.set(filename,mod);
 const code=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 function req(spec){
  if(spec==='@/lib/auth')return {getSessionUserId:async()=>uid};
  if(spec==='@/lib/repo')return repo;
  if(spec==='@/lib/journeys-db')return {takenSlots:async()=>[],createServiceBooking:async value=>bookings.push(structuredClone(value))};
  if(spec==='@/lib/notifications')return {createNotification:async()=>{},notifyAdmins:async()=>{}};
  if(spec.startsWith('@/')||spec.startsWith('.')){const base=spec.startsWith('@/')?path.join(root,spec.slice(2)):path.resolve(path.dirname(filename),spec);const file=[base,base+'.ts',base+'.tsx'].find(f=>fs.existsSync(f));return load(path.relative(root,file));}
  return require(spec);
 }
 new Function('require','module','exports',code)(req,mod,mod.exports);return mod.exports;
}
const pay=load('app/api/pay/notify/route.ts');
const booking=load('app/api/service/booking/route.ts');
const access=load('app/api/access/route.ts');
const cart=load('app/api/orders/route.ts');
const selection=load('lib/teacher-selection.ts');
const request=body=>new Request('https://test.local/api',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});

test('multi-teacher payment requires exactly one assigned teacher',async()=>{
 orders=[];uid='student';
 for(const teacherName of [undefined,'Unknown','Багш А, Багш Б']){
  const response=await pay.POST(request({itemId:'course',method:'bank',teacherName}));assert.equal(response.status,400);
 }
 assert.equal(orders.length,0);
 for(const name of [a.name,b.name]){
  assert.equal((await pay.POST(request({itemId:'course',method:'bank',teacherName:name}))).status,200);
  assert.equal(orders.at(-1).items[0].teacherName,name);assert.ok(orders.at(-1).customer.note.includes(name));
 }
});
test('selected teacher survives pending and paid access queries',async()=>{
 orders=[];uid='student';await pay.POST(request({itemId:'course',method:'bank',teacherName:b.name}));
 const get=()=>access.GET(new Request('https://test.local/api/access?itemId=course'));
 let result=await (await get()).json();assert.equal(result.status,'pending');assert.equal(result.teacherName,b.name);
 orders[0].status='paid';result=await (await get()).json();assert.equal(result.status,'active');assert.equal(result.teacherName,b.name);
 uid='someone-else';assert.equal((await (await get()).json()).status,'none');uid='student';
});
test('service booking validates and retains the selected teacher with the customer note',async()=>{
 bookings=[];const form={itemId:'service',name:'Test',phone:'99000000',date:'2050-01-10',time:'10:00',note:'My note'};
 assert.equal((await booking.POST(request(form))).status,400);assert.equal(bookings.length,0);
 assert.equal((await booking.POST(request({...form,teacherName:b.name}))).status,200);
 assert.equal(bookings[0].note,'Сонгосон багш: Багш Б\nMy note');
});
test('cart checkout cannot omit or forge a teacher for a CMS course',async()=>{
 orders=[];const body={items:[{kind:'course',slug:'course',qty:1}],customer:{name:'Test',email:'test@example.com',phone:'99000000'}};
 assert.equal((await cart.POST(request(body))).status,400);assert.equal(orders.length,0);
 body.items[0].teacherName=b.name;assert.equal((await cart.POST(request(body))).status,200);assert.equal(orders[0].items[0].teacherName,b.name);
});
test('zero and single teacher records retain the existing flow',()=>{
 assert.deepEqual(selection.resolveTeacherSelection({...course,teachers:[]},undefined),{name:undefined});
 assert.deepEqual(selection.resolveTeacherSelection({...course,teachers:[a]},undefined),{name:a.name});
 assert.deepEqual(selection.resolveTeacherSelection({...course,kind:'product'},undefined),{});
});
test('signed out payment and booking cannot create records',async()=>{
 uid=null;orders=[];bookings=[];
 assert.equal((await pay.POST(request({itemId:'course',teacherName:b.name}))).status,401);
 assert.equal((await booking.POST(request({itemId:'service',teacherName:b.name}))).status,401);
 assert.equal(orders.length,0);assert.equal(bookings.length,0);uid='student';
});
