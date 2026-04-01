import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
    try {
        const { email, planId, couponCode } = await req.json()

        if (!email || !planId) {
            return NextResponse.json({ error: "Email and Plan ID are required" }, { status: 400 })
        }

        // 1. Find the User & Agency
        const user = await prisma.user.findUnique({
            where: { email },
            include: { agency: true }
        })

        if (!user || !user.agencyId) {
            return NextResponse.json({ error: "Registration not found. Please complete step 1." }, { status: 404 })
        }

        const plan = await prisma.subscriptionPlan.findUnique({
            where: { id: planId }
        })

        if (!plan) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
        }

        // 2. Perform Upgrade in Transaction
        await prisma.$transaction(async (tx: any) => {
            // Update Agency Plan
            await tx.agency.update({
                where: { id: user.agencyId },
                data: { planId: plan.id }
            })

            // Update Subscription Record
            await tx.subscription.upsert({
                where: { agencyId: user.agencyId },
                update: {
                    plan: plan.name,
                    status: "ACTIVE",
                    currentPeriodEnd: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000) // 10 years (Lifetime)
                },
                create: {
                    agencyId: user.agencyId,
                    plan: plan.name,
                    status: "ACTIVE",
                    currentPeriodEnd: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000)
                }
            })

            // Increment Coupon Use if applicable
            if (couponCode) {
                await tx.coupon.update({
                    where: { code: couponCode.toUpperCase() },
                    data: { usedCount: { increment: 1 } }
                })
            }
        })

        return NextResponse.json({ message: "Plan activated successfully" })
    } catch (error: any) {
        console.error("[Manual Upgrade Error]:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
