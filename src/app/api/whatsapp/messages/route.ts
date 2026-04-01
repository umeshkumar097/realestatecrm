import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const leadId = searchParams.get("leadId")
  const { agencyId, role, id: userId } = session.user as any

  if (!leadId) {
    return NextResponse.json({ error: "Missing leadId" }, { status: 400 })
  }

  // Verify lead ownership/access
  const lead = await prisma.lead.findUnique({
    where: { id: leadId, agencyId },
    select: { assignedToId: true }
  })

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 })
  }

  if (role === "AGENT" && lead.assignedToId !== userId) {
    return NextResponse.json({ error: "Forbidden: You do not have access to this chat" }, { status: 403 })
  }

  const messages = await prisma.message.findMany({
    where: { 
      leadId,
      agencyId 
    },
    orderBy: { timestamp: "asc" },
  })

  return NextResponse.json(messages)
}
