import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { listBookingsByUser, listUserServiceBookings } from "@/lib/journeys-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [journeys, services] = await Promise.all([
      listBookingsByUser(uid),
      listUserServiceBookings(uid),
    ]);
    return NextResponse.json({ journeys, services });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Захиалга уншихад алдаа гарлаа." },
      { status: 500 },
    );
  }
}
