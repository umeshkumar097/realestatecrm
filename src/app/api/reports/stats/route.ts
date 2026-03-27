import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  console.log("[Reports API] Fetching metrics...");
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    console.error("[Reports API] Unauthenticated access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { agencyId, role, id: userId } = session.user as any
  console.log(`[Reports API] User: ${userId}, Role: ${role}, Agency: ${agencyId}`);

  if (!agencyId && role !== "SUPER_ADMIN") {
    console.error("[Reports API] No agency assigned to user");
    return NextResponse.json({ error: "No agency assigned" }, { status: 400 })
  }

  const whereLead: any = { agencyId }
  const whereTask: any = { agencyId }
  const whereTicket: any = { agencyId }

  if (role === "AGENT") {
    whereLead.assignedToId = userId
    whereTask.assignedToId = userId
    whereTicket.OR = [
      { assignedToId: userId },
      { lead: { assignedToId: userId } }
    ]
  }

  try {
    const [
      totalLeads,
      convertedLeads,
      siteVisitLeads,
      totalTasks,
      completeTasks,
      pendingTasks,
      totalTickets,
      openTickets
    ] = await Promise.all([
      prisma.lead.count({ where: whereLead }),
      prisma.lead.count({ where: { ...whereLead, status: "CONVERTED" } }),
      prisma.lead.count({ where: { ...whereLead, status: "SITE_VISIT" } }),
      prisma.task.count({ where: whereTask }),
      prisma.task.count({ where: { ...whereTask, status: "COMPLETE" } }),
      prisma.task.count({ where: { ...whereTask, status: "PENDING" } }),
      prisma.ticket.count({ where: whereTicket }),
      prisma.ticket.count({ where: { ...whereTicket, status: "OPEN" } })
    ])

    return NextResponse.json({
      leads: { total: totalLeads, converted: convertedLeads, siteVisit: siteVisitLeads },
      tasks: { total: totalTasks, complete: completeTasks, pending: pendingTasks },
      tickets: { total: totalTickets, open: openTickets }
    })
  } catch (error: any) {
    console.error("Reports API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
