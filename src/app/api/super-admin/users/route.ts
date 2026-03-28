import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const users = await prisma.user.findMany({
      include: {
        agency: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(users)
  } catch (error: any) {
    console.error("[Super-Admin Users API Error]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
