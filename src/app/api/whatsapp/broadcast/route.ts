import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const BRIDGE_URL = "http://203.57.85.225"
const BRIDGE_SECRET = "Umesh_WA_Bridge_2003"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId, id: agentId } = session.user as any
  const { ids, message } = await req.json()

  if (!Array.isArray(ids) || !message) {
    return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
  }

  const leads = await prisma.lead.findMany({
    where: { id: { in: ids }, agencyId },
    select: { id: true, phone: true }
  })

  if (leads.length === 0) return NextResponse.json({ error: "No clients found" }, { status: 404 })

  let successCount = 0
  let failCount = 0

  for (const lead of leads) {
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const res = await fetch(`${BRIDGE_URL}/send`, {
          method: "POST",
          headers: { 
              "Content-Type": "application/json",
              "x-bridge-secret": BRIDGE_SECRET 
          },
          body: JSON.stringify({ agentId, phone: lead.phone, message })
      })
      if (res.ok) successCount++
      else failCount++
    } catch (err) {
      failCount++
    }
  }

  return NextResponse.json({ success: successCount, failed: failCount, total: leads.length })
}
