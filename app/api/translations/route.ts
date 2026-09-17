import { NextResponse } from "next/server";
import { normalizeTranslationSource, translationCatalog } from "@/lib/translation-catalog";
import { cachedTranslations, supportedTranslationLocale, translationReady } from "@/lib/translation-service";
import { translateLiteral } from "@/data/literal-translations";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const requests=new Map<string,{count:number;until:number}>();
export async function GET() { return NextResponse.json({configured:translationReady(),languages:["mn","en","ko","ja","zh"]}); }
export async function POST(req:Request) {
  if (Number(req.headers.get("content-length")) > 60000) return NextResponse.json({error:"too_large"},{status:413});
  const raw=await req.text();
  if (raw.length>48000) return NextResponse.json({error:"too_large"},{status:413});
  let body;
  try {body=JSON.parse(raw);} catch {return NextResponse.json({error:"invalid_request"},{status:400});}
  if (!supportedTranslationLocale(body?.locale) || !Array.isArray(body?.sources) || body.sources.length>30 || body.sources.some((s:unknown)=>typeof s!=="string")) return NextResponse.json({error:"invalid_request"},{status:400});
  const sources=[...new Set<string>(body.sources.map(normalizeTranslationSource))].filter(Boolean);
  if (sources.reduce((n,s)=>n+s.length,0)>12000) return NextResponse.json({error:"too_large"},{status:413});
  const ip=req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const now=Date.now(), bucket=requests.get(ip);
  if(bucket && bucket.until>now && bucket.count>=60) return NextResponse.json({error:"rate_limited"},{status:429,headers:{"Retry-After":"60"}});
  if (requests.size>2000) requests.clear();
  requests.set(ip,{count:bucket && bucket.until>now ? bucket.count+1 : 1,until:bucket && bucket.until>now ? bucket.until : now+60000});
  try {
    const {allowed,overrides}=await translationCatalog(body.locale);
    const translations:Record<string,string>={}; const missing:string[]=[]; const ignored:string[]=[];
    for(const source of sources) {
      const known=translateLiteral(source,body.locale);
      if (overrides.has(source)) translations[source]=overrides.get(source)!;
      else if(known!==source) translations[source]=known;
      else if(allowed.has(source)) missing.push(source);
      else ignored.push(source);
    }
    if(missing.length && !translationReady()) return NextResponse.json({translations,ignored,unavailable:true});
    Object.assign(translations,await cachedTranslations(missing,body.locale));
    return NextResponse.json({translations,ignored});
  } catch {return NextResponse.json({error:"translation_unavailable"},{status:503});}
}
