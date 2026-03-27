import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId } = session.user as any
  if (!agencyId) return NextResponse.json({ status: "FREE" })

  const subscription = await prisma.subscription.findUnique({
    where: { agencyId }
  })

  return NextResponse.json({
    status: subscription?.status || "FREE",
    plan: subscription?.plan || "Starter",
    currentPeriodEnd: subscription?.currentPeriodEnd
  })
}
