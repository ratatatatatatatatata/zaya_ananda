// Exercise the actual provider callbacks, cart totals, storage, and return navigation.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const React = require('react');
const storage = () => { const values = new Map(); return {getItem: k => values.get(k) ?? null, setItem: (k,v) => values.set(k,v)}; };
const product = {kind:'product',slug:'notebook',title:{mn:'Дэвтэр'},price:50000,tone:'jade',glyph:'🛍'};
function harness({session = storage(), local = storage(), path = '/'} = {}) {
  let slots = [], cursor = 0, effects = [], pushes = [];
  global.sessionStorage = session; global.localStorage = local;
  global.window = {location: {origin:'https://www.zaya-ananda.com',pathname:path,search:'',hash:''}, scrollY:4200};
  const hook = init => { const i=cursor++; if (!(i in slots)) slots[i]=init(); return i; };
  const hooks = {...React,
    useState(initial) {const i=hook(()=>initial);return [slots[i],value=>{slots[i]=typeof value==='function'?value(slots[i]):value;}];},
    useRef(initial) {return slots[hook(()=>({current:initial}))];},
    useMemo(fn,deps) {const i=hook(()=>null);if(!slots[i]||deps.some((d,j)=>!Object.is(d,slots[i].deps[j])))slots[i]={deps,value:fn()};return slots[i].value;},
    useEffect(fn,deps) {const i=hook(()=>null);if(!slots[i]||deps.some((d,j)=>!Object.is(d,slots[i][j])))effects.push(fn);slots[i]=deps;},
  };
  hooks.useCallback=(fn,deps)=>hooks.useMemo(()=>fn,deps);
  const router={push:(...args)=>pushes.push(args)};
  const mod={exports:{}};
  const code=ts.transpileModule(fs.readFileSync(require.resolve('../lib/cart.tsx'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  new Function('require','module','exports',code)(name=>name==='react'?hooks:name==='next/navigation'?{usePathname:()=>window.location.pathname,useRouter:()=>router}:require(name),mod,mod.exports);
  function render() {cursor=0;const value=mod.exports.CartProvider({children:null}).props.value;const pending=effects;effects=[];pending.forEach(fn=>fn());return value;}
  render(); render();
  return {render,pushes,session,local};
}
test('minus removes the final unit, updates totals and persists without deleting other items',()=>{
  const h=harness(); let cart=h.render();cart.add(product,2);cart.add({...product,kind:'service',price:10000});
  cart=h.render();assert.equal(cart.count,3);assert.equal(cart.total,110000);
  cart.setQty('product','notebook',1);cart=h.render();assert.equal(cart.total,60000);
  cart.setQty('product','notebook',0);cart=h.render();assert.equal(cart.count,1);assert.equal(cart.total,10000);assert.equal(cart.items[0].kind,'service');
  const persisted=JSON.parse(h.local.getItem('zaya_cart_v2'));assert.equal(persisted.length,1);assert.equal(persisted[0].kind,'service');
  cart.remove('service','notebook');cart=h.render();assert.equal(cart.count,0);assert.equal(cart.total,0);assert.deepEqual(JSON.parse(h.local.getItem('zaya_cart_v2')),[]);
});
test('continue closes the drawer without leaving the homepage or product page',()=>{
  for(const path of ['/', '/item/notebook']) {
    const h=harness({path});let cart=h.render();cart.add(product);cart=h.render();assert.equal(cart.isOpen,true);
    cart.continueBrowsing();cart=h.render();assert.equal(cart.isOpen,false);assert.equal(window.scrollY,4200);assert.equal(h.pushes.length,0);
  }
});
test('cart return preserves the originating section, including after reload',()=>{
  const h=harness();window.location.hash='#shop';h.render().add(product);
  window.location.pathname='/cart';h.render().open();h.render().continueBrowsing();
  assert.deepEqual(h.pushes.at(-1),['/#shop',{scroll:false}]);assert.equal(JSON.parse(h.session.getItem('zaya_cart_return')).top,4200);
  const reloaded=harness({session:h.session,local:h.local,path:'/cart'});reloaded.render().continueBrowsing();assert.deepEqual(reloaded.pushes[0],['/#shop',{scroll:false}]);assert.equal(reloaded.render().count,1);
});
test('direct cart visits safely fall back to the shop',()=>{
  for(const stored of [null,{href:'https://elsewhere.example/',top:10},{href:'/checkout',top:5}]) {
    const h=harness({path:'/cart'});if(stored)h.session.setItem('zaya_cart_return',JSON.stringify(stored));h.render().continueBrowsing();assert.deepEqual(h.pushes[0],['/shop',{scroll:false}]);
  }
});
