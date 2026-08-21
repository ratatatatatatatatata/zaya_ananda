import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { checkAdmin, deleteMessage, getUserByEmail } from "@/lib/repo";
import { createNotification } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(req: Request) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await checkAdmin(uid)).ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deleteMessage(id);
  return NextResponse.json({ ok: true });
}

/** Админ зурвасд хариу бичих — тухайн хэрэглэгчид мэдэгдэл болж очно. */
export async function POST(req: Request) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await checkAdmin(uid)).ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const email = String(body?.email || "").trim();
  const subject = String(body?.subject || "Таны зурвас").trim();
  const reply = String(body?.reply || "").trim();
  if (!email || !reply) return NextResponse.json({ error: "Имэйл болон хариу шаардлагатай." }, { status: 400 });

  const user = await getUserByEmail(email).catch(() => null);
  if (!user) {
    return NextResponse.json(
      { error: "Энэ имэйлээр бүртгэлтэй хэрэглэгч олдсонгүй. Мэдэгдэл илгээх боломжгүй." },
      { status: 404 },
    );
  }

  await createNotification({
    userId: user.id,
    kind: "reply",
    title: "«" + subject + "» зурвасын хариу ирлээ",
    body: reply,
    link: "/account#notifications",
  });

  return NextResponse.json({ ok: true });
}
