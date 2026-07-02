// Имэйл илгээх — Resend (https://resend.com) ашиглана.
// Шаардлагатай env: RESEND_API_KEY, RESEND_FROM (жишээ: "Zaya's Ananda <no-reply@tanii-domain.mn>")
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "Zaya's Ananda <onboarding@resend.dev>";
  if (!key) throw new Error("Имэйл илгээх тохиргоо хийгдээгүй байна (RESEND_API_KEY).");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error("Имэйл илгээхэд алдаа гарлаа: " + text.slice(0, 200));
  }
}
