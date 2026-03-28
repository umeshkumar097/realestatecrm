import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params
  const { name, email, role } = await req.json()

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name, email, role }
    })
    return NextResponse.json(user)
  } catch (error: any) {
    console.error("[Super-Admin User Update Error]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params

  try {
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error: any) {
    console.error("[Super-Admin User Delete Error]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
