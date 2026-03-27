import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId } = session.user as any
  const { searchParams } = new URL(req.url)
  const leadId = searchParams.get("leadId")

  try {
    const [emis, dueSoon] = await Promise.all([
      prisma.eMI.findMany({
        where: { 
          agencyId,
          ...(leadId ? { leadId } : {})
        },
        include: {
          lead: { select: { name: true, phone: true } },
          project: { select: { name: true } }
        },
        orderBy: { startDate: "desc" }
      }),
      prisma.installment.count({
        where: {
          emi: { agencyId },
          status: "PENDING",
          dueDate: {
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ])

    return NextResponse.json({ emis, dueSoon })
  } catch (error: any) {
    console.error("[EMI API Error]:", error)
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error.message,
      emis: [],
      dueSoon: 0
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId } = session.user as any
  const { leadId, projectId, plotNumber, plotRate, totalPrice, planDetails, startDate, expiryDate } = await req.json()

  if (!leadId || !projectId || !plotNumber || !plotRate || !totalPrice || !startDate || !expiryDate) {
    return NextResponse.json({ error: "Missing required fields for EMI creation" }, { status: 400 })
  }

  const emi = await prisma.eMI.create({
    data: {
      leadId,
      projectId,
      plotNumber,
      plotRate,
      totalPrice,
      planDetails,
      startDate: new Date(startDate),
      expiryDate: new Date(expiryDate),
      agencyId
    }
  })

  // Update lead status to CONVERTED
  await prisma.lead.update({
    where: { id: leadId },
    data: { status: "CONVERTED" }
  })

  return NextResponse.json(emi, { status: 201 })
}
