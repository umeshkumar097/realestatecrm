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

    await prisma.lead.delete({ where })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete lead or access denied" }, { status: 500 })
  }
}
