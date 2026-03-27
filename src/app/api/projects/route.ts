import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId } = session.user as any
  const projects = await prisma.project.findMany({
    where: { agencyId },
    include: {
      _count: { select: { properties: true, emis: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId } = session.user as any
  const { name, location, description } = await req.json()

  if (!name || !location) {
    return NextResponse.json({ error: "Name and Location are required" }, { status: 400 })
  }

  const project = await prisma.project.create({
    data: {
      name,
      location,
      description,
      agencyId
    }
  })

  return NextResponse.json(project, { status: 201 })
}
