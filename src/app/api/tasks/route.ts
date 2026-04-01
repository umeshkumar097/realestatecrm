import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId, id: userId, role } = session.user as any
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")

  const where: any = { agencyId }
  if (role === "AGENT") {
    where.assignedToId = userId
  }
  if (status) where.status = status

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { dueDate: "asc" },
    include: {
      assignedTo: { select: { name: true } }
    }
  })

  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId, id: userId } = session.user as any
  const { title, description, status, dueDate, assignedToId } = await req.json()

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 })

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status || "TODAY",
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedToId: assignedToId || userId,
      agencyId
    }
  })

  return NextResponse.json(task, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId, role, id: userId } = session.user as any
  const { id, status } = await req.json()

  try {
    const where: any = { id, agencyId }
    if (role === "AGENT") {
      where.assignedToId = userId
    }

    const task = await prisma.task.update({
      where,
      data: { status }
    })

    return NextResponse.json(task)
  } catch (error: any) {
    return NextResponse.json({ error: "Task not found or access denied" }, { status: 500 })
  }
}
