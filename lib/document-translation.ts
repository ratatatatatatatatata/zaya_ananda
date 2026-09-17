import { translateLiteral } from "@/data/literal-translations";
import type { Locale } from "./types";

const originals = new WeakMap<Text,string>();
const applied = new WeakMap<Text,string>();
const originalAttributes = new WeakMap<Element,Map<string,string>>();
const appliedAttributes = new WeakMap<Element,Map<string,string>>();
const attributes = ["placeholder","title","aria-label","alt"];
const normalize = (value:string) => value.replace(/\s+/gu," ").trim();
const skip = "script,style,noscript,code,pre,textarea,[contenteditable='true'],[translate='no']";
const caches = new Map<Locale,Map<string,string>>();

/** Translate text nodes only: never replace React-owned elements or form values. */
export function observeDocumentTranslation(locale:Locale) {
  let disposed=false, frame=0, timer=0, running=false, unavailable=false;
  const controller=new AbortController();
  const queue=new Set<string>(), attempted=new Set<string>();
  const cache=caches.get(locale) || new Map<string,string>(); caches.set(locale,cache);
  const storageKey=`zaya_translations_v1_${locale}`;
  try { for(const [key,value] of Object.entries(JSON.parse(sessionStorage.getItem(storageKey)||"{}"))) if(typeof value==="string") cache.set(key,value); } catch { /* optional cache */ }
  const schedule = () => { if(!disposed && !frame) frame=requestAnimationFrame(run); };
  const translateValue = (value:string) => {
    const source=normalize(value);
    if(!source) return value;
    const known=translateLiteral(source,locale);
    let result=known!==source ? known : cache.get(source) || source;
    if(locale!=="mn" && result===source && /[А-Яа-яӨөҮүЁё]/u.test(source) && source.length<=12000 && !unavailable && !attempted.has(source)) {
      queue.add(source);
      if(!running && !timer) timer=window.setTimeout(flush,80);
    }
    return value.match(/^\s*/)?.[0] + result + (value.match(/\s*$/)?.[0] || "");
  };
  const translateTree = (root:ParentNode) => {
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node=walker.nextNode() as Text|null;
    while(node) {
      if(node.parentElement && !node.parentElement.closest(skip)) {
        const current=node.nodeValue || "";
        if(applied.get(node)!==current) originals.set(node,current);
        const next=translateValue(originals.get(node) ?? current);
        if(next!==current) node.nodeValue=next;
        applied.set(node,next);
      }
      node=walker.nextNode() as Text|null;
    }
  };
  const observer=new MutationObserver(schedule);
  const watch = () => observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributes});
  function run() {
    frame=0;
    if(disposed) return;
    observer.disconnect();
    translateTree(document.body);
    for(const element of document.body.querySelectorAll("[placeholder],[title],[aria-label],img[alt]")) {
      if(element.closest(skip)) continue;
      const sourceMap=originalAttributes.get(element)||new Map<string,string>();
      const appliedMap=appliedAttributes.get(element)||new Map<string,string>();
      for(const attribute of attributes) {
        const current=element.getAttribute(attribute);if(current===null)continue;
        if(appliedMap.get(attribute)!==current)sourceMap.set(attribute,current);
        const next=translateValue(sourceMap.get(attribute) ?? current);
        if(next!==current)element.setAttribute(attribute,next);
        appliedMap.set(attribute,next);
      }
      originalAttributes.set(element,sourceMap);appliedAttributes.set(element,appliedMap);
    }
    watch();
  }
  async function flush() {
    timer=0;
    if(disposed || running || unavailable || !queue.size)return;
    const sources:string[]=[];let size=0;
    for(const source of queue) {
      if(sources.length>=30 || size+source.length>12000)break;
      sources.push(source);size+=source.length;queue.delete(source);attempted.add(source);
    }
    if(!sources.length)return;
    running=true;
    try {
      const response=await fetch("/api/translations",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({locale,sources}),signal:controller.signal});
      if(!response.ok) { unavailable=true;return; }
      const result=await response.json() as {translations?:Record<string,string>;unavailable?:boolean};
      if(disposed)return;
      unavailable=!!result.unavailable;
      for(const [source,value] of Object.entries(result.translations||{})) if(typeof value==="string" && value)cache.set(source,value);
      try { sessionStorage.setItem(storageKey,JSON.stringify(Object.fromEntries([...cache].slice(-2000)))); } catch { /* optional */ }
      schedule();
    } catch { if(!disposed)unavailable=true; }
    finally { running=false; if(!disposed && !unavailable && queue.size)timer=window.setTimeout(flush,100); }
  }
  run();
  return () => {disposed=true;controller.abort();observer.disconnect();cancelAnimationFrame(frame);clearTimeout(timer);};
}
