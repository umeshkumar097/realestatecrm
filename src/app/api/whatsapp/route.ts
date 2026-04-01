import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { baileysManager } from "@/lib/whatsapp/baileys-manager"

/**
 * Pure Vercel API Route (No VPS Bridge) 🛰️
 * Directly communicates with the Database-Powered WhatsApp Engine.
 */

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  const status = await baileysManager.getStatus(userId)

  return NextResponse.json({ 
    status: status?.status || "DISCONNECTED", 
    qr: status?.qrCode || null 
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { action, force } = await req.json().catch(() => ({ action: null, force: false }))
  const { id: userId, agencyId } = (session.user as any)

  if (action === "connect") {
    // Initiate connection - Vercel will run this in a fire-and-forget manner
    // because we have Database-level upserts for the QR.
    baileysManager.connect(userId, agencyId, force).catch(() => null)
    return NextResponse.json({ message: "Connecting initiated locally on Vercel" })
  }

  if (action === "disconnect") {
    await baileysManager.logout(userId)
    return NextResponse.json({ message: "Disconnected" })
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}
