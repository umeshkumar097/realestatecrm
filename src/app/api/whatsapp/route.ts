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
  
  let instance = await baileysManager.getInstance(userId)
  let qrDataUrl: string | null = null
  let status = instance?.status || "DISCONNECTED"

  // 1. Check in-memory instance first
  if (instance?.qr) {
    qrDataUrl = await QRCode.toDataURL(instance.qr, { width: 300, margin: 2 })
  } 
  
  // 2. Fallback to Database if in-memory is missing or has no QR
  if (!qrDataUrl) {
    const dbSession = await prisma.whatsAppSession.findUnique({
      where: { agentId: userId }
    })
    
    if (dbSession?.status === "CONNECTING" && dbSession.qrCode) {
        status = "CONNECTING"
        qrDataUrl = await QRCode.toDataURL(dbSession.qrCode, { width: 300, margin: 2 })
    } else if (dbSession?.status === "CONNECTED") {
        status = "CONNECTED"
    }
  }

  return NextResponse.json({ 
    status, 
    qr: qrDataUrl 
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { action } = await req.json()
  const { id: userId, agencyId } = (session.user as any)

  if (action === "connect") {
    const { force } = await req.json().catch(() => ({ force: false }))
    if (!agencyId) return NextResponse.json({ error: "No agency assigned to your profile" }, { status: 400 })
    // Fire-and-forget with optional force reset
    baileysManager.init(userId, agencyId, force).catch(console.error)
    return NextResponse.json({ message: "Connecting…" })
  }

  if (action === "disconnect") {
    await baileysManager.logout(userId)
    return NextResponse.json({ message: "Disconnected" })
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}
