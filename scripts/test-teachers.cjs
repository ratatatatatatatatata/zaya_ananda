// Regression coverage for multi-teacher selection, persistence, and legacy records.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const root = path.resolve(__dirname, '..');
const a = {name:'Багш А',image:'/a.jpg',role:'А чиглэл',info:'А танилцуулга'};
const b = {name:'Багш Б',image:'/b.jpg',role:'Б чиглэл',info:'Б танилцуулга'};
let db, failSettingsRead;
const copy = value => structuredClone(value);
const storage = {
  supabaseReady: true, enc: encodeURIComponent,
  async sbSelect(table,query='') {
    if(table==='site_settings' && failSettingsRead) throw Error('read unavailable');
    let rows = db[table] || [];
    const id = query.match(/id=eq\.([^&]+)/)?.[1];
    if(id) rows=rows.filter(row=>row.id===decodeURIComponent(id));
    return copy(rows);
  },
  async sbInsert(table,row) {db[table].push(copy(row));return copy(row);},
  async sbUpdate(table,id,patch) {const row=db[table].find(row=>row.id===id);if(!row)return null;Object.assign(row,copy(patch));return copy(row);},
};
const modules = new Map();
function load(relative) {
  const filename=path.resolve(root,relative);
  if(modules.has(filename))return modules.get(filename).exports;
  const mod={exports:{}};modules.set(filename,mod);
  const code=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  function req(spec) {
    if(filename.endsWith('/lib/repo.ts')) {
      if(spec==='./supabase')return storage;
      if(spec==='./auth')return {};
      if(spec==='@/data/content')return {services:[],courses:[],products:[]};
      if(spec==='next/cache')return {unstable_cache:fn=>fn};
    }
    if(spec.startsWith('.') || spec.startsWith('@/')) {
      const base=spec.startsWith('@/')?path.join(root,spec.slice(2)):path.resolve(path.dirname(filename),spec);
      const f=[base,base+'.ts',base+'.tsx'].find(f=>fs.existsSync(f));
      return load(path.relative(root,f));
    }
    return require(spec);
  }
  new Function('require','module','exports',code)(req,mod,mod.exports);
  return mod.exports;
}
const helpers=load('lib/item-teachers.ts');
const repo=load('lib/repo.ts');
function reset(){db={site_settings:[{id:'main',teachers:[copy(a),copy(b)],contact:{phone:'unchanged'}}],cms_items:[]};failSettingsRead=false;}

 test('legacy combined names recover distinct matching teacher profiles',()=>{
  const profiles=helpers.itemTeachers({teacherName:'Багш А, Багш Б',teacherImage:'/wrong-shared.jpg',teacherInfo:'wrong shared bio'},[a,b,{name:'Багш А, Багш Б',image:'/combined.jpg'}]);
  assert.deepEqual(profiles,[a,b]);
  const missing=helpers.itemTeachers({teacherName:'Багш А, Unknown',teacherImage:'/old.jpg',teacherInfo:'old bio'},[a]);
  assert.equal(missing[1].image,'');assert.equal(missing[1].info,'');
 });
 test('two teachers survive create, read, edit, removal, and empty selection',async()=>{
  reset();
  const item=await repo.createCmsItem({kind:'service',title:'Test',teachers:[a,b]});
  let read=await repo.getCmsById(item.id);
  assert.deepEqual(read.teachers,[a,b]);
  assert.equal(db.cms_items[0].teacherName,'Багш А, Багш Б');
  assert.equal('teachers' in db.cms_items[0],false,'no undeployed database column');
  assert.equal(db.site_settings[0].teachers.length,2,'no combined-name preset');
  const edited={...b,image:'/b-new.jpg',info:'Б шинэ танилцуулга'};
  await repo.updateCmsItem(item.id,{kind:'service',title:'Test',teachers:[a,edited]});
  read=await repo.getCmsById(item.id);assert.deepEqual(read.teachers,[a,edited]);
  await repo.updateCmsItem(item.id,{kind:'service',title:'Test',teachers:[edited]});
  read=await repo.getCmsById(item.id);assert.deepEqual(read.teachers,[edited]);assert.equal(read.teacherImage,'/b-new.jpg');
  await repo.updateCmsItem(item.id,{kind:'service',title:'Test',teachers:[]});
  read=await repo.getCmsById(item.id);assert.equal(read.teacherName,null);assert.deepEqual(helpers.itemTeachers(read),[]);
  assert.equal(db.site_settings[0].teachers.length,2,'removing a selection keeps profiles');
  assert.equal(db.site_settings[0].contact.phone,'unchanged');
 });
 test('profile read failures cannot overwrite the existing teacher catalogue',async()=>{
  reset();failSettingsRead=true;
  await assert.rejects(()=>repo.createCmsItem({kind:'service',title:'Test',teachers:[a,b]}),/read unavailable/);
  assert.deepEqual(db.site_settings[0].teachers,[a,b]);assert.equal(db.cms_items.length,0);failSettingsRead=false;
 });
 test('legacy clients keep separate presets on save',async()=>{
  reset();const item=await repo.createCmsItem({kind:'course',title:'Legacy',teacherName:'Багш А, Багш Б',teacherImage:'/wrong.jpg'});
  assert.deepEqual((await repo.getCmsById(item.id)).teachers,[a,b]);assert.equal(db.site_settings[0].teachers.length,2);
 });
 test('public teacher component renders each picture and complete biography',()=>{
  const {ItemTeachers}=load('components/ItemTeachers.tsx');
  const html=renderToStaticMarkup(React.createElement(ItemTeachers,{item:{teachers:[a,b]}}));
  for(const value of [a.image,a.info,a.name,b.image,b.info,b.name])assert.ok(html.includes(value),value);
  assert.equal((html.match(/data-teacher-profile/g)||[]).length,2);
 });
 test('admin selection shows two independent forms and removing one keeps the other',()=>{
  const {TeacherPicker}=load('components/TeacherPicker.tsx');let rows=[];
  const onChange=fn=>{rows=typeof fn==='function'?fn(rows):fn;};
  const draw=()=>TeacherPicker({value:rows,presets:[a,b],onChange,onError:message=>{throw Error(message);}});
  function nodes(node,found=[]) {if(!node || typeof node!=='object')return found;if(Array.isArray(node)){node.forEach(n=>nodes(n,found));return found;}found.push(node);nodes(node.props?.children,found);return found;}
  nodes(draw()).find(n=>n.type==='button'&&n.props.children===a.name).props.onClick();
  nodes(draw()).find(n=>n.type==='button'&&n.props.children===b.name).props.onClick();
  assert.equal(rows.length,2);assert.equal(rows[0].image,a.image);assert.equal(rows[1].info,b.info);
  assert.equal(nodes(draw()).filter(n=>n.type==='fieldset').length,2);
  nodes(draw()).find(n=>n.type==='button'&&n.props.children===a.name).props.onClick();
  assert.equal(rows.length,1);assert.equal(rows[0].name,b.name);assert.equal(rows[0].image,b.image);
 });
