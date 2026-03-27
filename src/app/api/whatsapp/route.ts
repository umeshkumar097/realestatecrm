import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { baileysManager } from "@/lib/whatsapp/baileys-manager"
import QRCode from "qrcode"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  const instance = await baileysManager.getInstance(userId)

  if (!instance) {
    return NextResponse.json({ status: "DISCONNECTED", qr: null })
  }

  let qrDataUrl: string | null = null
  if (instance.qr) {
    try {
      qrDataUrl = await QRCode.toDataURL(instance.qr, { width: 300, margin: 2 })
    } catch (err) {
      console.error("QR Generation Error:", err)
    }
  }

  return NextResponse.json({ 
    status: instance.status, 
    qr: qrDataUrl 
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { action } = await req.json()
  const { id: userId, agencyId } = (session.user as any)

  if (action === "connect") {
    if (!agencyId) return NextResponse.json({ error: "No agency assigned to your profile" }, { status: 400 })
    // Fire-and-forget
    baileysManager.init(userId, agencyId).catch(console.error)
    return NextResponse.json({ message: "Connecting…" })
  }

  if (action === "disconnect") {
    await baileysManager.logout(userId)
    return NextResponse.json({ message: "Disconnected" })
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}
