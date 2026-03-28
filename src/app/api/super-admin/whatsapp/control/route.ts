import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { baileysManager } from "@/lib/whatsapp/baileys-manager"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { action, message } = await req.json()

  try {
    if (action === "reset") {
      const result = await baileysManager.resetAll()
      return NextResponse.json({ message: `Reset triggered for ${result.count} active sessions.` })
    }

    if (action === "broadcast") {
      if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 })
      
      const instances = baileysManager.getAllInstances()
      const connectedInstances = instances.filter(i => i.status === "CONNECTED")
      
      let successCount = 0
      for (const instance of connectedInstances) {
        try {
          // Sending to self as a broadcast test/announcement
          await baileysManager.sendMessage(instance.agentId, "me", message)
          successCount++
        } catch (e) {
          console.error(`Broadcast failed for ${instance.agentId}`, e)
        }
      }
      
      return NextResponse.json({ message: `Broadcast sent to ${successCount} active sessions.` })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("[WhatsApp Control API Error]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
