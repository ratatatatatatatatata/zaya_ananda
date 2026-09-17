// Regression coverage: admin authorization, gallery persistence, legacy clients, and public display.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const root = path.resolve(__dirname, '..');
let rows = [], user = 'admin', admin = true;
const copy = value => structuredClone(value);
const storage = {
  async sbSelect(table,query='') {
    const id = query.match(/id=eq\.([^&]+)/)?.[1], slug = query.match(/slug=eq\.([^&]+)/)?.[1];
    return copy(rows.filter(row => (!id || row.id === decodeURIComponent(id)) && (!slug || row.slug === decodeURIComponent(slug))));
  },
  async sbInsert(table,row) {rows.push({gallery:[], ...copy(row)});return copy(rows.at(-1));},
  async sbUpdate(table,id,patch) {const row=rows.find(row=>row.id===id);Object.assign(row,copy(patch));return copy(row);},
};
const modules = new Map();
function load(relative) {
  const filename=path.resolve(root,relative);
  if(modules.has(filename))return modules.get(filename).exports;
  const mod={exports:{}};modules.set(filename,mod);
  const code=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  const req=spec=> {
    if(spec==='@/lib/supabase')return storage;
    if(spec==='@/lib/auth')return {getSessionUserId:async()=>user};
    if(spec==='@/lib/repo')return {checkAdmin:async()=>({ok:admin})};
    if(spec==='next/cache')return {revalidateTag(){}, revalidatePath(){}};
    if(spec.startsWith('@/'))return load(spec.slice(2)+(fs.existsSync(path.join(root,spec.slice(2)+'.ts'))?'.ts':'.tsx'));
    return require(spec);
  };
  new Function('require','module','exports',code)(req,mod,mod.exports);
  return mod.exports;
}
const api=load('app/api/admin/journeys/route.ts');
const {parseJourneyGallery}=load('lib/journey-gallery.ts');
const photos=[{image:'/one.jpg',caption:'Нэг'},{image:'/two.jpg',caption:'Хоёр'}];
const body={name:'Аялал',slug:'journey',image:'/hero.jpg',itinerary:[],destination:[],gallery:photos};
const request=value=>new Request('http://localhost/api/admin/journeys',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)});

test('admin create, public read, reorder, omitted-field preservation, and clear',async()=>{
  rows=[];user='admin';admin=true;
  let res=await api.POST(request(body));assert.equal(res.status,200);
  const created=(await res.json()).item;
  assert.deepEqual(created.gallery,photos);
  assert.deepEqual((await load('lib/journeys-db.ts').getJourneyBySlug('journey')).gallery,photos);
  res=await api.PUT(request({...body,id:created.id,gallery:[photos[1],{...photos[0],caption:'Шинэ'}]}));assert.equal(res.status,200);
  assert.deepEqual(rows[0].gallery,[photos[1],{...photos[0],caption:'Шинэ'}]);
  const {gallery,...legacy}=body;
  await api.PUT(request({...legacy,id:created.id}));assert.equal(rows[0].gallery[0].image,'/two.jpg');
  await api.PUT(request({...body,id:created.id,gallery:[]}));assert.deepEqual(rows[0].gallery,[]);
});
test('unauthenticated and non-admin requests cannot add photos',async()=>{
  const before=copy(rows);user=null;
  assert.equal((await api.POST(request(body))).status,401);
  user='member';admin=false;
  assert.equal((await api.PUT(request({...body,id:rows[0].id}))).status,403);
  assert.deepEqual(rows,before);user='admin';admin=true;
});
test('invalid photo sources, large input and invalid gallery types are rejected',()=>{
  for(const raw of [null,{},[{image:'javascript:alert(1)'}],[{image:'data:text/html;base64,aaa'}],Array(31).fill(photos[0]),[{image:'/x'.repeat(1100000)}]])assert.throws(()=>parseJourneyGallery(raw));
  assert.deepEqual(parseJourneyGallery([{image:' /one.jpg ',caption:' Нэг '}]),[photos[0]]);
});
test('public gallery uses additional photos only and hides empty legacy galleries',()=>{
  const {JourneyGallery}=load('components/journey/JourneyGallery.tsx');
  const render=journey=>renderToStaticMarkup(React.createElement(JourneyGallery,{journey}));
  assert.equal(render({...body,gallery:undefined}),'');
  const html=render({...body,gallery:photos});
  assert.ok(html.includes('/one.jpg'));assert.ok(html.includes('/two.jpg'));
  assert.ok(!html.includes('/hero.jpg'));assert.ok(html.includes('rotate(-3deg)'));assert.ok(html.includes('padding-top:68px'));
});
