import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { checkAdmin } from "@/lib/repo";
import { translateBatch, translationReady } from "@/lib/translation-service";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST() {
  const uid=await getSessionUserId();
  if(!uid || !(await checkAdmin(uid)).ok) return NextResponse.json({error:"forbidden"},{status:403});
  if(!translationReady())return NextResponse.json({configured:false,healthy:false});
  try {
    const result=await translateBatch(["Тавтай морилно уу."],"en");
    return NextResponse.json({configured:true,healthy:!!result[0]});
  } catch { return NextResponse.json({configured:true,healthy:false}); }
}
