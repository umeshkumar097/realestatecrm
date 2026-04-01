import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const BRIDGE_URL = process.env.WHATSAPP_BRIDGE_URL || "http://137.184.114.109";
const BRIDGE_SECRET = process.env.WHATSAPP_BRIDGE_SECRET || "Umesh_WA_Bridge_2003";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { phone, message } = await req.json()
  const userId = (session.user as any).id

  if (!phone || !message) {
    return NextResponse.json({ error: "Phone and Message are required" }, { status: 400 })
  }

  try {
    const res = await fetch(`${BRIDGE_URL}/send`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "x-bridge-secret": BRIDGE_SECRET 
        },
        body: JSON.stringify({ agentId: userId, phone, message })
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: any) {
    console.error("WhatsApp Send Error:", err)
    return NextResponse.json({ error: "Failed to reach VPS Bridge" }, { status: 500 })
  }
}
