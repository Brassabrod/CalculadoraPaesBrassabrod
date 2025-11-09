import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
)

export async function POST(req: Request) {
  const hottok = req.headers.get("x-hotmart-hottok")
  if (hottok !== process.env.HOTMART_HOTTOK) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const email =
    body?.buyer?.email ||
    body?.data?.buyer?.email ||
    body?.subscriber?.email ||
    ""
  const event =
    (body?.event || body?.data?.event || body?.status || "").toUpperCase()

  if (!email) {
    return NextResponse.json({ ok: false, error: "No email found" }, { status: 400 })
  }

  const allowEvents = ["APPROVED", "SUBSCRIPTION_ACTIVATED", "CONFIRMED"]
  const blockEvents = ["CANCELED", "REFUNDED", "CHARGEBACK", "EXPIRED"]

  if (allowEvents.includes(event)) {
    await supabase.from("allowed_emails").upsert({
      email: email.toLowerCase(),
      status: "active",
      source: "hotmart",
    })
    return NextResponse.json({ ok: true, action: "allowed", email })
  }

  if (blockEvents.includes(event)) {
    await supabase.from("allowed_emails").delete().eq("email", email.toLowerCase())
    return NextResponse.json({ ok: true, action: "blocked", email })
  }

  return NextResponse.json({ ok: true, action: "ignored", event })
}
