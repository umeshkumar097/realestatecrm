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
    const logs = await prisma.systemLog.findMany({
      take: 50,
      orderBy: { createdAt: "desc" }
    })

    // System health metrics (mocked as they usually come from infra monitoring)
    const health = {
        dbLatency: "14ms",
        compute: "2 Core / 8GB",
        load: "3.2% LOAD",
        throughput: "8.2k rpm",
        status: "OPERATIONAL"
    }

    return NextResponse.json({ logs, health })
  } catch (error) {
    console.error("[System Logs API Error]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await prisma.systemLog.deleteMany({})
    return NextResponse.json({ message: "Logs purged successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to purge logs" }, { status: 500 })
  }
}
