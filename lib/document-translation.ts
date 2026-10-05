import { translateLiteral } from "@/data/literal-translations";
import { hasTranslatableText, normalizeTranslationSource as normalize, splitTranslationText } from "./translation-text";
import type { Locale } from "./types";

const originals = new WeakMap<Text,string>();
const applied = new WeakMap<Text,string>();
const originalAttributes = new WeakMap<Element,Map<string,string>>();
const appliedAttributes = new WeakMap<Element,Map<string,string>>();
const attributes = ["placeholder","title","aria-label","alt"];
const skip = "script,style,noscript,code,pre,textarea,[contenteditable='true'],[translate='no']";
const caches = new Map<Locale,Map<string,string>>();

/** Preserve React-owned nodes and user-entered form values. Only public allowlisted text is sent to the provider. */
export function observeDocumentTranslation(locale:Locale) {
  let disposed=false, frame=0, timer=0, running=false, unavailable=false, retryDelay=100;
  const controller=new AbortController();
  const queue=new Set<string>(), pending=new Set<string>(), ignored=new Set<string>();
  const attempts=new Map<string,number>();
  const cache=caches.get(locale) || new Map<string,string>(); caches.set(locale,cache);
  const storageKey=`zaya_translations_azure_v1_${locale}`;
  try {
    const saved=JSON.parse(sessionStorage.getItem(storageKey)||"null");
    if(saved?.expires>Date.now()) for(const [key,value] of Object.entries(saved.translations||{})) if(typeof value==="string")cache.set(key,value);
  } catch { /* optional cache */ }
  const schedule = () => { if(!disposed && !frame) frame=requestAnimationFrame(run); };
  const queueSource = (source:string) => {
    if(locale==="mn" || !hasTranslatableText(source) || unavailable || ignored.has(source) || pending.has(source) || (attempts.get(source)||0)>=3) return;
    queue.add(source);
    if(!running && !timer) timer=window.setTimeout(flush,retryDelay);
  };
  const translatePart = (source:string) => {
    const known=translateLiteral(source,locale);
    if(known!==source) return known;
    if(cache.has(source)) return cache.get(source)!;
    queueSource(source);
    return source;
  };
  const translateValue = (value:string):string => {
    const source=normalize(value);
    if(!source) return value;
    const known=translateLiteral(source,locale);
    if(known===source && /[\r\n]/.test(value)) return value.split(/(\r?\n+)/).map(part=>/^[\r\n]+$/.test(part)?part:translateValue(part)).join("");
    if(known===source && locale==="mn")return value;
    // Keep counters and accessible-label suffixes attached to their translated title.
    const counter=source.match(/^(.+?)(\s*[·]\s*\d+(?:\s*\/\s*\d+)?)$/u);
    const label=source.match(/^(.+) — (тоглуулах|танилцуулга|мэдээлэл)$/u);
    if(known===source && counter)return translateValue(counter[1])+counter[2];
    if(known===source && label)return translateValue(label[1])+" — "+translateLiteral(label[2],locale);
    const result=known!==source ? known : locale==="mn" ? source : splitTranslationText(source).map(translatePart).join(" ");
    return (value.match(/^\s*/)?.[0] || "") + result + (value.match(/\s*$/)?.[0] || "");
  };
  const translateTree = (root:ParentNode) => {
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node=walker.nextNode() as Text|null;
    while(node) {
      if(node.parentElement && !node.parentElement.closest(skip)) {
        const current=node.nodeValue || "";
        if(applied.get(node)!==current) originals.set(node,current);
        const next=translateValue(originals.get(node) ?? current);
        if(next!==current) {
          // An option without a value otherwise submits its translated label.
          const parent=node.parentElement;
          if(parent.tagName==="OPTION" && !parent.hasAttribute("value"))parent.setAttribute("value",parent.textContent || "");
          node.nodeValue=next;
        }
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
  function retry(sources:string[], delay:number) {
    retryDelay=delay;
    for(const source of sources) if((attempts.get(source)||0)<3)queue.add(source);
  }
  async function flush() {
    timer=0;
    if(disposed || running || unavailable || !queue.size)return;
    const sources:string[]=[];let size=0;
    for(const source of queue) {
      if(sources.length>=30 || size+source.length>12000)break;
      sources.push(source);size+=source.length;queue.delete(source);pending.add(source);
      attempts.set(source,(attempts.get(source)||0)+1);
    }
    if(!sources.length)return;
    running=true;
    try {
      const response=await fetch("/api/translations",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({locale,sources}),signal:controller.signal});
      if(!response.ok) {
        if(response.status===429 || response.status>=500) retry(sources,response.status===429?60000:2000);
        else sources.forEach(source=>ignored.add(source));
        return;
      }
      const result=await response.json() as {translations?:Record<string,string>;ignored?:string[];pending?:string[];unavailable?:boolean;retryable?:boolean;retryAfter?:number};
      if(disposed)return;
      unavailable=!!result.unavailable;
      for(const source of result.ignored||[])ignored.add(source);
      for(const [source,value] of Object.entries(result.translations||{})) if(typeof value==="string" && value)cache.set(source,value);
      if(result.retryable)retry(result.pending||sources.filter(source=>!cache.has(source)&&!ignored.has(source)),Math.min(60000,Math.max(2000,(result.retryAfter||2)*1000)));
      else retryDelay=100;
      try { sessionStorage.setItem(storageKey,JSON.stringify({expires:Date.now()+3600000,translations:Object.fromEntries([...cache].slice(-2000))})); } catch { /* optional */ }
      schedule();
    } catch { if(!disposed)retry(sources,2000); }
    finally {
      sources.forEach(source=>pending.delete(source));
      running=false;
      if(!disposed && !unavailable && queue.size)timer=window.setTimeout(flush,retryDelay);
    }
  }
  // A transient outage must not disable translations for the rest of a visit.
  const resume = () => { unavailable=false; attempts.clear(); retryDelay=100; schedule(); };
  window.addEventListener("online",resume);
  window.addEventListener("zaya:translations-retry",resume);
  run();
  return () => {disposed=true;controller.abort();observer.disconnect();cancelAnimationFrame(frame);clearTimeout(timer);window.removeEventListener("online",resume);window.removeEventListener("zaya:translations-retry",resume);};
}
