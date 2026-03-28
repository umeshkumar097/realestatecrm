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
    let settings = await prisma.systemSetting.findUnique({
      where: { id: "global" }
    })

    if (!settings) {
      settings = await prisma.systemSetting.create({
        data: { id: "global" }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const updates = await req.json()

  try {
    const settings = await prisma.systemSetting.update({
      where: { id: "global" },
      data: updates
    })

    // Log the change
    await prisma.systemLog.create({
        data: {
            type: "SYSTEM",
            level: "INFO",
            action: `Global settings updated by ${session.user?.email}`,
            details: updates
        }
    })

    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
