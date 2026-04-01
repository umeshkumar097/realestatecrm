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
  const { 
      leadId, projectId, plotNumber, plotRate, totalPrice, planDetails, 
      startDate, frequency, totalInstallments, installmentAmount 
  } = await req.json()

  if (!leadId || !projectId || !plotNumber || !plotRate || !totalPrice || !startDate || !totalInstallments || !installmentAmount) {
    return NextResponse.json({ error: "Missing required fields for Automated EMI creation" }, { status: 400 })
  }

  try {
      const result = await (prisma as any).$transaction(async (tx: any) => {
          // 1. Calculate Expiry Date based on frequency and count
          const start = new Date(startDate)
          const monthsToAdd = frequency === "QUARTERLY" ? totalInstallments * 3 : totalInstallments
          const expiryDate = new Date(start)
          expiryDate.setMonth(expiryDate.getMonth() + monthsToAdd)

          // 2. Create the Master EMI Record
          const emi = await tx.eMI.create({
              data: {
                  leadId,
                  projectId,
                  plotNumber,
                  plotRate: parseFloat(plotRate),
                  totalPrice: parseFloat(totalPrice),
                  installmentAmount: parseFloat(installmentAmount),
                  totalInstallments: parseInt(totalInstallments),
                  frequency,
                  planDetails,
                  startDate: start,
                  expiryDate: expiryDate,
                  nextDueDate: start, // First payment due on start date
                  agencyId
              }
          })

          // 3. Generate individual Installment records
          const installmentsData = []
          for (let i = 0; i < totalInstallments; i++) {
              const dueDate = new Date(start)
              const interval = frequency === "QUARTERLY" ? 3 : 1
              dueDate.setMonth(dueDate.getMonth() + (i * interval))

              installmentsData.push({
                  emiId: emi.id,
                  amount: parseFloat(installmentAmount),
                  dueDate: dueDate,
                  status: "PENDING"
              })
          }

          await tx.installment.createMany({
              data: installmentsData
          })

          // 4. Transform Lead Status
          await tx.lead.update({
            where: { id: leadId },
            data: { status: "CONVERTED" }
          })

          return emi
      })

      return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
      console.error("[EMI Creation Error]:", error)
      return NextResponse.json({ error: "Failed to create financial schedule", details: error.message }, { status: 500 })
  }
}
