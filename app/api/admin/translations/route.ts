import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { checkAdmin } from "@/lib/repo";
import { translateBatch, translationReady, translationIssue } from "@/lib/translation-service";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST() {
  const uid=await getSessionUserId();
  if(!uid || !(await checkAdmin(uid)).ok) return NextResponse.json({error:"forbidden"},{status:403});
  if(!translationReady())return NextResponse.json({provider:"azure",configured:false,healthy:false,issue:"not_configured"});
  try {
    const result=await translateBatch(["Тавтай морилно уу."],"en");
    return NextResponse.json({provider:"azure",configured:true,healthy:!!result[0]});
  } catch (error) { return NextResponse.json({provider:"azure",configured:true,healthy:false,issue:translationIssue(error)}); }
}
