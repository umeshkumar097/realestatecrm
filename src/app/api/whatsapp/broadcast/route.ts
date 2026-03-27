import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { baileysManager } from "@/lib/whatsapp/baileys-manager"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId, id: agentId } = session.user as any
  const { ids, message } = await req.json()

  if (!Array.isArray(ids) || !message) {
    return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
  }

  // Fetch leads to get their phone numbers
  const leads = await prisma.lead.findMany({
    where: {
      id: { in: ids },
      agencyId
    },
    select: { id: true, phone: true }
  })

  if (leads.length === 0) return NextResponse.json({ error: "No clients found" }, { status: 404 })

  // Check if WhatsApp is connected
  try {
     const instance = await baileysManager.getInstance(agentId)
     if (!instance || instance.status !== "CONNECTED") {
        return NextResponse.json({ error: "WhatsApp not connected. Please connect from dashboard first." }, { status: 400 })
     }
  } catch (e) {
     return NextResponse.json({ error: "WhatsApp service unavailable" }, { status: 500 })
  }

  // Perform broadcast in background (though here we await to give summary)
  let successCount = 0
  let failCount = 0

  for (const lead of leads) {
    try {
      // Add defensive delay (800ms) to prevent spam flagging
      await new Promise(resolve => setTimeout(resolve, 800))
      
      await baileysManager.sendMessage(agentId, lead.phone, message)
      successCount++
    } catch (err) {
      console.error(`[Broadcast Error] Failed for ${lead.phone}:`, err)
      failCount++
    }
  }

  return NextResponse.json({ 
    success: successCount, 
    failed: failCount,
    total: leads.length 
  })
}
