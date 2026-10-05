const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');
const root=path.resolve(__dirname,'..'),modules=new Map();
const cms=[{title:'Тусгай сургалт',summary:'Шинэ тайлбар',body:'<p>Нийтийн тайлбар</p>',i18n:{en:{title:'Hand-written course'}}}];
const repo={listCmsCached:async kind=>kind==='course'?cms:[],getSettingsCached:async()=>({teachers:[{name:'Нийтийн багш',info:'Багшийн танилцуулга'}],bank:{holder:'Нууц данс'}}),listPagesCached:async()=>[]};
function load(relative){const file=path.resolve(root,relative);if(modules.has(file))return modules.get(file).exports;const mod={exports:{}};modules.set(file,mod);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;const req=name=>{if(name==='next/cache')return {unstable_cache:fn=>fn};if(name==='./repo')return repo;if(name==='./journeys-db')return {listJourneysCached:async()=>[{name:'Аяллын нэр',transport:'Галт тэрэг'}]};if(name.startsWith('@/')||name.startsWith('.')){const base=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);if(base.endsWith('.json'))return require(base);return load([base,base+'.ts',base+'.tsx'].find(f=>fs.existsSync(f)));}return require(name);};new Function('require','module','exports',code)(req,mod,mod.exports);return mod.exports;}
const {translateLiteral}=load('data/literal-translations.ts');const api=load('app/api/translations/route.ts');
const request=value=>new Request('https://example.com/api/translations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)});
test('five-language labels round-trip from any previously selected language',()=>{for(const locale of ['mn','en','ko','ja','zh']){const result=translateLiteral('Аяллын зургууд',locale);assert.ok(result);if(locale!=='mn')assert.notEqual(result,'Аяллын зургууд');assert.equal(translateLiteral(result,'mn'),'Аяллын зургууд');}assert.equal(translateLiteral('  Аяллын   зургууд ','en'),'Journey photos');assert.equal(translateLiteral('Account','mn'),'Бүртгэл');assert.equal(translateLiteral('Данс','ko'),'계좌');});
test('manual translations take precedence and only published text goes to the provider',async()=>{process.env.GOOGLE_TRANSLATE_API_KEY='test-only';let sent=[];global.fetch=async(url,opts)=>{assert.equal(url,'https://translation.googleapis.com/language/translate/v2');const body=JSON.parse(opts.body);sent.push(...body.q);return Response.json({data:{translations:body.q.map(q=>({translatedText:'Translated '+q}))}});};const r=await api.POST(request({locale:'en',sources:['Тусгай сургалт','Нийтийн тайлбар','Багшийн танилцуулга','Галт тэрэг','Нууц данс','Хэрэглэгчийн хувийн зурвас']}));const b=await r.json();assert.equal(b.translations['Тусгай сургалт'],'Hand-written course');assert.deepEqual(sent.sort(),['Нийтийн тайлбар','Галт тэрэг'].sort());assert.deepEqual(b.ignored,['Нууц данс','Хэрэглэгчийн хувийн зурвас']);});
test('missing provider is reported accurately while built-in labels still work',async()=>{delete process.env.GOOGLE_TRANSLATE_API_KEY;const b=await (await api.POST(request({locale:'ja',sources:['Аяллын зургууд','Шинэ тайлбар']}))).json();assert.equal(b.unavailable,true);assert.equal(b.translations['Аяллын зургууд'],'旅の写真');assert.equal(b.translations['Шинэ тайлбар'],undefined);assert.equal((await (await api.GET()).json()).configured,false);});
test('invalid locales, oversized requests and provider failures fail safely',async()=>{assert.equal((await api.POST(request({locale:'ru',sources:['Аяллын зургууд']}))).status,400);assert.equal((await api.POST(request({locale:'en',sources:Array(31).fill('Нэг')}))).status,400);assert.equal((await api.POST(request({locale:'en',sources:['А'.repeat(12001)]}))).status,413);process.env.GOOGLE_TRANSLATE_API_KEY='test-only';global.fetch=async()=>new Response('',{status:403});const failed=await (await api.POST(request({locale:'ko',sources:['Шинэ тайлбар','Аяллын зургууд']}))).json();assert.equal(failed.retryable,true);assert.deepEqual(failed.pending,['Шинэ тайлбар']);assert.equal(failed.translations['Аяллын зургууд'],'여행 사진');delete process.env.GOOGLE_TRANSLATE_API_KEY;});
test('DOM translation preserves nodes, skipped form content and restores Mongolian',()=>{const node={nodeValue:'  Аяллын зургууд  ',parentElement:{closest:()=>null}},protectedNode={nodeValue:'Аяллын зургууд',parentElement:{closest:()=>({})}};global.NodeFilter={SHOW_TEXT:4};global.document={body:{querySelectorAll:()=>[]},createTreeWalker:()=>{let index=0;return{nextNode:()=>[node,protectedNode][index++]||null};}};global.MutationObserver=class{observe(){}disconnect(){}};global.requestAnimationFrame=()=>1;global.cancelAnimationFrame=()=>{};global.sessionStorage={getItem:()=>null,setItem(){}};global.window={setTimeout,clearTimeout,addEventListener(){},removeEventListener(){}};const {observeDocumentTranslation}=load('lib/document-translation.ts');for(const locale of ['en','ko','ja','zh','mn']){const stop=observeDocumentTranslation(locale);assert.equal(node.nodeValue,'  '+translateLiteral('Аяллын зургууд',locale)+'  ');assert.equal(protectedNode.nodeValue,'Аяллын зургууд');stop();}});

test('public rich text and long descriptions share client/server chunks without including secrets',async()=>{
  const {addPublicText,collectPublicText}=load('lib/translation-catalog.ts');
  const {splitTranslationText}=load('lib/translation-text.ts');
  const text='Аяллын дэлгэрэнгүй тайлбар. '.repeat(600).trim();
  const allowed=new Set();addPublicText(allowed,'<p>'+text+'</p><p>Сүм &amp; байгаль &#x1F33F;</p>');
  for(const chunk of splitTranslationText(text)){assert.ok(chunk.length<=1800);assert.ok(allowed.has(chunk));}
  assert.equal(splitTranslationText(text).join(' '),text);
  assert.ok(allowed.has('Сүм & байгаль 🌿'));
  collectPublicText(allowed,{teacherName:'Олон багшийн нэр',price:'Үнэ удахгүй нэмэгдэнэ',summary:'An English summary',lessons:[{path:'private-lesson-path'}],bank:{holder:'Хувийн данс'},email:'private@example.com'});
  assert.ok(allowed.has('Олон багшийн нэр'));assert.ok(allowed.has('Үнэ удахгүй нэмэгдэнэ'));assert.ok(allowed.has('An English summary'));
  assert.equal(allowed.has('Хувийн данс'),false);assert.equal(allowed.has('private-lesson-path'),false);assert.equal(allowed.has('private@example.com'),false);
});
test('translation provider autodetects mixed content and decodes text entities',async()=>{
  process.env.GOOGLE_TRANSLATE_API_KEY='test-only';
  global.fetch=async(url,opts)=>{const body=JSON.parse(opts.body);assert.equal(body.source,undefined);assert.equal(body.target,'zh-CN');assert.equal(opts.headers['X-goog-api-key'],'test-only');return Response.json({data:{translations:[{translatedText:'自然 &amp; 静心'}]}});};
  const {translateBatch}=load('lib/translation-service.ts');assert.deepEqual(await translateBatch(['English and Монгол'],'zh'),['自然 & 静心']);delete process.env.GOOGLE_TRANSLATE_API_KEY;
});
test('DOM queue retries a transient provider failure, applies long text, and restores its exact original',async()=>{
  const original='Онцгой шинэ агуулгын дэлгэрэнгүй тайлбар. '.repeat(80).trim();
  const node={nodeValue:original,parentElement:{closest:()=>null}};const jobs=[];const frames=[];
  global.document={body:{querySelectorAll:()=>[]},createTreeWalker:()=>{let used=false;return{nextNode:()=>used?null:(used=true,node)};}};
  global.requestAnimationFrame=fn=>{frames.push(fn);return frames.length;};global.cancelAnimationFrame=()=>{};
  global.window={setTimeout:fn=>{jobs.push(fn);return jobs.length;},clearTimeout(){},addEventListener(){},removeEventListener(){}};
  let calls=0;global.fetch=async(url,opts)=>{calls++;if(calls===1)return new Response('',{status:503});const {sources}=JSON.parse(opts.body);return Response.json({translations:Object.fromEntries(sources.map((source,i)=>[source,'Translation '+i]))});};
  const {observeDocumentTranslation}=load('lib/document-translation.ts');const stop=observeDocumentTranslation('en');
  await jobs.shift()();assert.equal(calls,1);await jobs.shift()();while(frames.length)frames.shift()();
  assert.equal(calls,2);assert.match(node.nodeValue,/Translation 0/);assert.doesNotMatch(node.nodeValue,/Онцгой/);stop();
  const restore=observeDocumentTranslation('mn');assert.equal(node.nodeValue,original);restore();
});

test('Mongolian restoration preserves paragraphs and translated options preserve submitted values',()=>{
  const attributes={};const option={tagName:'OPTION',textContent:'Аяллын зургууд',closest:()=>null,hasAttribute:key=>key in attributes,setAttribute:(key,value)=>{attributes[key]=value;}};
  const node={nodeValue:'Аяллын зургууд',parentElement:option};
  const paragraph={nodeValue:'Эхний мөр\n\nДараагийн мөр',parentElement:{closest:()=>null}};
  global.document={body:{querySelectorAll:()=>[]},createTreeWalker:()=>{let i=0;return{nextNode:()=>[node,paragraph][i++]||null};}};
  const {observeDocumentTranslation}=load('lib/document-translation.ts');const stop=observeDocumentTranslation('en');assert.equal(node.nodeValue,'Journey photos');assert.equal(attributes.value,'Аяллын зургууд');assert.ok(paragraph.nodeValue.includes('\n\n'));stop();
  const restore=observeDocumentTranslation('mn');assert.equal(paragraph.nodeValue,'Эхний мөр\n\nДараагийн мөр');assert.equal(node.nodeValue,'Аяллын зургууд');restore();
});
