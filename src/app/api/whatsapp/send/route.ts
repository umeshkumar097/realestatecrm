import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { baileysManager } from "@/lib/whatsapp/baileys-manager"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { phone, message } = await req.json()
  const userId = (session.user as any).id

  if (!phone || !message) {
    return NextResponse.json({ error: "Phone and Message are required" }, { status: 400 })
  }

  try {
    const res = await baileysManager.sendMessage(userId, phone, message)
    return NextResponse.json({ success: true, res })
  } catch (err: any) {
    console.error("WhatsApp Send Error:", err)
    return NextResponse.json({ error: err.message || "Failed to send message" }, { status: 500 })
  }
}
