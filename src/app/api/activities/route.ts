import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const leadId = searchParams.get("leadId")
  const { agencyId } = session.user as any

  if (!leadId) return NextResponse.json({ error: "Lead ID required" }, { status: 400 })

  const activities = await prisma.activity.findMany({
    where: { leadId, agencyId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json(activities)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: userId, agencyId } = session.user as any
  const { leadId, type, content } = await req.json()

  console.log(`[POST Activity] Lead: ${leadId}, Type: ${type}, User: ${userId}, Agency: ${agencyId}`)

  if (!leadId || !type || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const activity = await prisma.activity.create({
      data: {
        type,
        content,
        leadId,
        userId,
        agencyId
      }
    })
    console.log(`[POST Activity] Success for lead ${leadId}`)
    return NextResponse.json(activity, { status: 201 })
  } catch (error: any) {
    console.error(`[POST Activity] Error: ${error.message}`)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
