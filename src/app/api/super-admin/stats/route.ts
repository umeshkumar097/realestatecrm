import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role

  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const [
      totalAgencies,
      totalAgents,
      totalLeads,
      activeSessions,
      activeSubscriptions,
      newAgenciesThisWeek,
      totalSessions,
      failedSessions
    ] = await Promise.all([
      prisma.agency.count(),
      prisma.user.count({ where: { role: "AGENT" } }),
      prisma.lead.count(),
      prisma.whatsAppSession.count({ where: { status: "CONNECTED" } }),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.agency.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.whatsAppSession.count(),
      prisma.whatsAppSession.count({ where: { status: "DISCONNECTED" } })
    ])

    // Specific Revenue logic from PAID installments
    const paidInstallmentsAgg = await prisma.installment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true }
    })
    
    const revenue = paidInstallmentsAgg._sum.amount || 0
    const mrr = revenue / 12 // Simplified approximation
    const ltv = totalAgencies > 0 ? revenue / totalAgencies : 0
    const churn = 0

    const recentTransactions = await prisma.installment.findMany({
      where: { status: "PAID" },
      take: 10,
      orderBy: { updatedAt: "desc" },
      include: {
        emi: {
          include: {
            agency: { select: { name: true } }
          }
        }
      }
    })

    return NextResponse.json({
      stats: {
        totalAgencies,
        totalAgents,
        totalLeads,
        activeSessions,
        totalSubscriptions: activeSubscriptions,
        newAgenciesThisWeek,
        revenue: `₹${(revenue / 100000).toFixed(1)}L`,
        mrr: `₹${(mrr / 100000).toFixed(1)}L`,
        ltv: `₹${ltv.toLocaleString()}`,
        churn: `${churn}%`,
        whatsapp: {
            total: totalSessions,
            active: activeSessions,
            failed: failedSessions,
            retrying: Math.max(0, totalSessions - activeSessions - failedSessions)
        },
        recentTransactions: recentTransactions.map(t => ({
            id: t.id,
            agency: t.emi.agency.name,
            amount: t.amount,
            date: t.updatedAt,
            status: t.status
        }))
      }
    })
  } catch (error: any) {
    console.error("[Superadmin Stats Error]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
