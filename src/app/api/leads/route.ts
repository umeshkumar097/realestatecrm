import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { syncLeadToGoogleSheets } from "@/lib/integrations/google-sheets"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId, role, id: userId } = session.user as any
  if (!agencyId) return NextResponse.json({ error: "No agency assigned" }, { status: 400 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")?.trim()
  const search = searchParams.get("search")

  const where: any = { agencyId }
  
  // RBAC: Agents only see their assigned leads
  if (role === "AGENT") {
    where.assignedToId = userId
  }

  // Validate status before querying Prisma to avoid 500 errors
  const validStatuses = ['NEW', 'CONNECTED', 'NOT_CONNECTED', 'QUALIFIED', 'NOT_QUALIFIED', 'SITE_VISIT', 'CONVERTED', 'LOST']
  if (status && status !== 'ALL') {
    if (validStatuses.includes(status)) {
      where.status = status
    } else {
      console.warn(`Invalid status requested: ${status}`)
      // If invalid status, we just don't filter by it or return empty
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }

  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "100")
  const skip = (page - 1) * limit

  try {
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
        include: {
          assignedTo: { select: { name: true } },
          _count: { select: { messages: true } }
        }
      }),
      prisma.lead.count({ where })
    ])

    return NextResponse.json({
      leads,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    })
  } catch (error: any) {
    console.error("Prisma error fetching leads:", error)
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId, id: userId } = session.user as any
  const body = await req.json()
  const { name, phone, email, status, propertyType, budget, location, notes } = body

  if (!name || !phone) {
    return NextResponse.json({ error: "Name and Phone are required" }, { status: 400 })
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        email,
        status: status || "NEW",
        propertyType,
        budget,
        location,
        notes,
        agencyId,
        assignedToId: userId // Default to creator
      }
    })

    // ASYNC: Sync to Google Sheets
    syncLeadToGoogleSheets(lead).catch(err => console.error("Sheets Async Sync failed:", err))

    return NextResponse.json(lead, { status: 201 })
  } catch (error: any) {
    console.error("Lead Create Error:", error)
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 })
  }
}
