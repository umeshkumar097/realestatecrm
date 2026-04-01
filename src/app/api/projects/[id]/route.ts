import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId, role } = session.user as any
  if (role !== "ADMIN" && role !== "AGENCY_OWNER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    // Before deleting project, we should check for properties or emis
    const project = await prisma.project.findUnique({
      where: { id: id },
      include: {
        _count: { select: { properties: true, emis: true } }
      }
    })

    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })
    if (project.agencyId !== agencyId) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    if (project._count.properties > 0) {
        return NextResponse.json({ error: "Cannot delete project with active properties. Delete units first." }, { status: 400 })
    }

    await prisma.project.delete({
      where: { id: id }
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
