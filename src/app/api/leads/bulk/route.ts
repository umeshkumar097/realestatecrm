import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId } = session.user as any
  const { leads } = await req.json()

  if (!Array.isArray(leads)) {
    return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
  }

  const formattedLeads = leads
    .map((l: any) => {
      const phone = String(l.phone || "").replace(/\D/g, "")
      if (!phone) return null
      return {
        name: l.name || "Bulk Client",
        phone,
        email: l.email || null,
        budget: l.budget || null,
        location: l.location || null,
        notes: l.notes || null,
        agencyId,
        assignedToId: userId, // Assign to the user who uploaded
        status: "NEW"
      }
    })
    .filter(Boolean) as any[]

  if (formattedLeads.length === 0) {
    return NextResponse.json({ created: 0, skipped: leads.length })
  }

  try {
    const result = await prisma.lead.createMany({
      data: formattedLeads,
      skipDuplicates: true
    })

    return NextResponse.json({ 
      created: result.count, 
      skipped: leads.length - result.count 
    })
  } catch (err: any) {
    console.error("[Bulk Upload Error]:", err)
    return NextResponse.json({ error: "Failed to process bulk upload", details: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId } = session.user as any
  const { ids } = await req.json()

  if (!Array.isArray(ids)) {
    return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
  }

  try {
    const result = await prisma.lead.deleteMany({
      where: {
        id: { in: ids },
        agencyId
      }
    })

    return NextResponse.json({ deleted: result.count })
  } catch (err: any) {
    console.error("[Bulk Delete Error]:", err)
    return NextResponse.json({ error: "Failed to delete clients" }, { status: 500 })
  }
}
