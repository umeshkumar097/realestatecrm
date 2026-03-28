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
    const [agencies, plans] = await Promise.all([
      prisma.agency.findMany({
        include: {
          _count: {
            select: {
              users: true,
              leads: true,
              whatsappSessions: true
            }
          },
          plan: true,
          subscription: true
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.subscriptionPlan.findMany()
    ])

    return NextResponse.json({ agencies, plans })
  } catch (error: any) {
    console.error("[Superadmin Agency API Error]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const { id, status, planId } = await req.json()
    
    const agency = await prisma.agency.update({
      where: { id },
      data: { 
        ...(status && { status }),
        ...(planId && { planId })
      }
    })

    return NextResponse.json({ success: true, agency })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update agency" }, { status: 500 })
  }
}
