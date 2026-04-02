import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: leadId } = await params
  const { agencyId, role, id: userId } = session.user as any
  const { status, notes, name, phone, email, budget, location } = await req.json()

  try {
    const where: any = { id: leadId, agencyId }
    if (role === "AGENT") {
      where.assignedToId = userId
    }

    const lead = await prisma.lead.update({
      where,
      data: { 
        ...(status && { status }),
        ...(notes && { notes }),
        ...(name && { name }),
        ...(phone && { phone }),
        ...(email && { email }),
        ...(budget && { budget }),
        ...(location && { location })
      }
    })

    return NextResponse.json(lead)
  } catch (error: any) {
    console.error(`[PATCH Lead] Error: ${error.message}`)
    return NextResponse.json({ error: "Lead not found or access denied" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: leadId } = await params
  const { agencyId, role, id: userId } = session.user as any

  try {
    const where: any = { id: leadId, agencyId }
    
    // Only Admin/Owner or the Assigned Agent can delete
    if (role === "AGENT") {
      where.assignedToId = userId
    }

    // Deep Delete: Remove all dependent records first to avoid constraint errors
    await prisma.$transaction([
      // 1. Delete all installments related to the lead's EMIs
      prisma.installment.deleteMany({
        where: { emi: { leadId } }
      }),
      // 2. Delete all EMIs
      prisma.eMI.deleteMany({
        where: { leadId }
      }),
      // 3. Delete all WhatsApp Messages
      prisma.message.deleteMany({
        where: { leadId }
      }),
      // 4. Delete all Support Tickets
      prisma.ticket.deleteMany({
        where: { leadId }
      }),
      // 5. Delete all Activity logs
      prisma.activity.deleteMany({
        where: { leadId }
      }),
      // 6. Finally delete the lead itself
      prisma.lead.delete({
        where
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[DELETE Lead Error]:", error)
    return NextResponse.json({ error: "Failed to delete lead or access denied" }, { status: 500 })
  }
}
