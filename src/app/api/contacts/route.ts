import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId } = session.user as any
  if (!agencyId) return NextResponse.json({ error: "No agency assigned" }, { status: 400 })

  const contacts = await prisma.user.findMany({
    where: { agencyId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  })

  return NextResponse.json(contacts)
}
