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
      revenueData
    ] = await Promise.all([
      prisma.agency.count(),
      prisma.user.count({ where: { role: "AGENT" } }),
      prisma.lead.count(),
      prisma.whatsAppSession.count({ where: { status: "CONNECTED" } }),
      prisma.eMI.aggregate({
        _sum: { totalPrice: true }
      })
    ])

    const revenue = revenueData._sum.totalPrice || 0

    return NextResponse.json({
      stats: {
        totalAgencies,
        totalAgents,
        totalLeads,
        activeSessions,
        revenue: `₹${(revenue / 100000).toFixed(1)}L`
      }
    })
  } catch (error: any) {
    console.error("[Superadmin Stats Error]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
