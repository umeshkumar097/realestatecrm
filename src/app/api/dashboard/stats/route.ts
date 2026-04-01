import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId, role, id: userId } = session.user as any

  if (!agencyId && role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "No agency assigned" }, { status: 400 })
  }

  // Filter based on role: Agents only see their data, Admins see all agency data, Super Admin sees system-wide data
  const filter: any = {}
  
  if (role === "SUPER_ADMIN") {
    // No agency filter for Super Admin
  } else if (role === "AGENT") {
    filter.agencyId = agencyId
    filter.assignedToId = userId
  } else {
    filter.agencyId = agencyId
  }

  // Define global where clause for models that share the same filter
  const globalWhere = role === "SUPER_ADMIN" ? {} : { agencyId }

  const [
    totalLeads,
    newLeads,
    activeProperties,
    closedDeals,
    recentLeads,
    messagesCount,
    sourceCounts,
    revenueData
  ] = await Promise.all([
    prisma.lead.count({ where: filter }),
    prisma.lead.count({ where: { ...filter, status: "NEW" } }),
    prisma.property.count({ where: globalWhere }),
    prisma.lead.count({ where: { ...filter, status: "CONVERTED" } }),
    prisma.lead.findMany({
      where: filter,
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { assignedTo: { select: { name: true } } }
    }),
    prisma.message.count({ 
      where: { 
        ...globalWhere,
        ...(role === "AGENT" ? { lead: { assignedToId: userId } } : {})
      } 
    }),
    prisma.lead.groupBy({
      by: ['source'],
      where: filter,
      _count: { source: true }
    }),
    prisma.eMI.aggregate({
      where: { 
        ...globalWhere,
        ...(role === "AGENT" ? { lead: { assignedToId: userId } } : {})
      },
      _sum: { totalPrice: true }
    })
  ])

  const total = totalLeads || 1
  const sources = sourceCounts.map(s => ({
    name: s.source || "Unknown",
    value: Math.round((s._count.source / total) * 100),
    color: s.source === "WHATSAPP" ? "bg-emerald-500" : "bg-blue-500"
  }))

  const revenue = revenueData._sum.totalPrice || 0

  return NextResponse.json({
    stats: {
      totalLeads,
      newLeads,
      activeProperties,
      closedDeals,
      revenue: `\u20B9${(revenue / 100000).toFixed(1)}L`,
      messagesCount,
      sources
    },
    recentLeads: recentLeads.map(l => ({
      id: l.id,
      name: l.name || "Unknown",
      phone: l.phone,
      status: l.status,
      time: l.updatedAt,
      assignedTo: l.assignedTo?.name
    }))
  })
}
