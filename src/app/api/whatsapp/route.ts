import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { baileysManager } from "@/lib/whatsapp/baileys-manager"
import { prisma } from "@/lib/prisma"
import QRCode from "qrcode"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  const agencyId = (session.user as any).agencyId
  
  // High-Fidelity VPS Proxy Sequence
  const BRIDGE_URL = "http://203.57.85.225:8080"
  const BRIDGE_SECRET = "Umesh_WA_Bridge_2003"

  try {
      const res = await fetch(`${BRIDGE_URL}/status/${userId}`, {
          headers: { "x-bridge-secret": BRIDGE_SECRET }
      })
      if (res.ok) {
          const data = await res.json()
          return NextResponse.json(data)
      }
  } catch (e) {
      console.error("[Vercel] VPS Bridge Status Fetch Failed:", e)
  }

  // Local Fallback (Standard Metadata) if Bridge is Offline
  const dbSession = await prisma.whatsAppSession.findUnique({ where: { agentId: userId } })
  return NextResponse.json({ 
    status: dbSession?.status || "DISCONNECTED", 
    qr: null 
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { action } = await req.json().catch(() => ({ action: null }))
  const { id: userId, agencyId } = (session.user as any)

  const BRIDGE_URL = "http://203.57.85.225:8080"
  const BRIDGE_SECRET = "Umesh_WA_Bridge_2003"

  if (action === "connect") {
    const { force } = await req.json().catch(() => ({ force: false }))
    
    await fetch(`${BRIDGE_URL}/connect`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "x-bridge-secret": BRIDGE_SECRET 
        },
        body: JSON.stringify({ agentId: userId, agencyId, force })
    }).catch(console.error)

    return NextResponse.json({ message: "Connecting initiated on VPS Cluster" })
  }

  if (action === "disconnect") {
    await fetch(`${BRIDGE_URL}/logout`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "x-bridge-secret": BRIDGE_SECRET 
        },
        body: JSON.stringify({ agentId: userId })
    }).catch(console.error)

    return NextResponse.json({ message: "Disconnected" })
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}
