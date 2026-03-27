import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ agencyId: string, leadId: string }> }
) {
  const { agencyId, leadId } = await params

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      agency: true,
      emis: {
        include: { project: true }
      },
      tickets: {
        orderBy: { createdAt: "desc" }
      }
    }
  })

  if (!lead || lead.agencyId !== agencyId) {
    return NextResponse.json({ error: "Portal not found" }, { status: 404 })
  }

  return NextResponse.json({
    lead: {
      id: lead.id,
      name: lead.name,
      phone: lead.phone
    },
    agency: {
      id: lead.agency.id,
      name: lead.agency.name
    },
    emis: lead.emis,
    tickets: lead.tickets
  })
}
