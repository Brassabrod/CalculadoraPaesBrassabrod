// api/hotmart-webhook.ts  — Serverless Function (Vercel) para projetos React
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
)

export default async function handler(req, res) {
  // A Hotmart às vezes testa com GET
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "Webhook ativo" })
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" })
  }

  const hottok = req.headers["x-hotmart-hottok"]
  if (hottok !== process.env.HOTMART_HOTTOK) {
    return res.status(401).json({ ok: false, error: "Unauthorized" })
  }

  let body = req.body
  if (typeof body === "string") {
    try { body = JSON.parse(body) } catch {}
  }

  const email = String(
    body?.buyer?.email ||
    body?.data?.buyer?.email ||
    body?.subscriber?.email ||
    body?.purchase?.buyer?.email ||
    ""
  ).toLowerCase()

  if (!email) {
    return res.status(400).json({ ok: false, error: "No email found" })
  }

  const event = String(
    body?.event ||
    body?.data?.event ||
    body?.status ||
    body?.purchase?.status ||
    ""
  ).toUpperCase()

  const allow = ["APPROVED","SUBSCRIPTION_ACTIVATED","CONFIRMED","COMPLETE"].includes(event)
  const block = ["CANCELED","CANCELLED","REFUNDED","CHARGEBACK","SUBSCRIPTION_CANCELED","SUBSCRIPTION_EXPIRED","EXPIRED"].includes(event)

  try {
    if (allow) {
      await supabase.from("allowed_emails").upsert(
        { email, status: "active", source: "hotmart" },
        { onConflict: "email" }
      )
      return res.status(200).json({ ok: true, action: "allowed", email, event })
    }

    if (block) {
      await supabase.from("allowed_emails").delete().eq("email", email)
      return res.status(200).json({ ok: true, action: "blocked", email, event })
    }

    return res.status(200).json({ ok: true, action: "ignored", event })
  } catch (e:any) {
    return res.status(500).json({ ok: false, error: e?.message || "DB error" })
  }
}
