import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId } = session.user as any
  if (!agencyId) return NextResponse.json({ status: "FREE" })

  const agency = await (prisma as any).agency.findUnique({
    where: { id: agencyId },
    select: {
        gstNumber: true,
        billingAddress: true,
        billingEmail: true,
        subscription: true,
        plan: true,
        _count: { select: { users: true } }
    }
  })

  return NextResponse.json({
    status: agency?.subscription?.status || "FREE",
    plan: agency?.plan?.name || "Free Trial",
    currentPeriodEnd: agency?.subscription?.currentPeriodEnd,
    usage: {
        users: agency?._count?.users || 0,
        maxUsers: agency?.plan?.maxAgents || 5,
    },
    gstNumber: agency?.gstNumber,
    billingAddress: agency?.billingAddress,
    billingEmail: agency?.billingEmail
  })
}
