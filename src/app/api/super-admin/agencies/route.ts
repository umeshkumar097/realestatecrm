import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role

  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const agencies = await prisma.agency.findMany({
      include: {
        _count: {
          select: {
            users: true,
            leads: true,
            projects: true
          }
        },
        subscription: true
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ agencies })
  } catch (error: any) {
    console.error("[Superadmin API Error]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
