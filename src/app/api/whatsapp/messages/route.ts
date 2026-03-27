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

  if (!leadId) {
    return NextResponse.json({ error: "Missing leadId" }, { status: 400 })
  }

  const messages = await prisma.message.findMany({
    where: { 
      leadId,
      agencyId 
    },
    orderBy: { timestamp: "asc" },
  })

  return NextResponse.json(messages)
}
