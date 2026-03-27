import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId, role, id: userId } = session.user as any
  const where: any = { agencyId }
  
  // Agents only see tickets assigned to them or related to their leads
  if (role === "AGENT") {
    where.OR = [
      { assignedToId: userId },
      { lead: { assignedToId: userId } }
    ]
  }

  const tickets = await prisma.ticket.findMany({
    where,
    include: {
      lead: { select: { name: true, phone: true } },
      project: { select: { name: true } },
      assignedTo: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json(tickets)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId } = session.user as any
  const { subject, description, type, leadId, projectId } = await req.json()

  if (!subject || !leadId) {
    return NextResponse.json({ error: "Subject and Lead are required" }, { status: 400 })
  }

  const ticket = await prisma.ticket.create({
    data: {
      subject,
      description,
      type: type || "SUPPORT",
      status: "OPEN",
      leadId,
      projectId,
      agencyId
    }
  })

  return NextResponse.json(ticket, { status: 201 })
}
