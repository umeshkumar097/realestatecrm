import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId } = session.user as any
  const body = await req.json()

  try {
    // Only allow updating certain fields to prevent breaking historical payment logic
    const emi = await prisma.eMI.update({
      where: { id, agencyId },
      data: {
        plotNumber: body.plotNumber,
        plotRate: body.plotRate ? parseFloat(body.plotRate) : undefined,
        totalPrice: body.totalPrice ? parseFloat(body.totalPrice) : undefined,
        planDetails: body.planDetails,
        status: body.status,
      }
    })

    return NextResponse.json(emi)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update EMI plan", details: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId, role } = session.user as any
  if (role !== "ADMIN" && role !== "AGENCY_OWNER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    await prisma.$transaction(async (tx) => {
        // 1. Delete all associated installments first
        await tx.installment.deleteMany({
            where: { emiId: id }
        })

        // 2. Delete the master EMI record
        await tx.eMI.delete({
            where: { id, agencyId }
        })
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete EMI plan", details: error.message }, { status: 500 })
  }
}
