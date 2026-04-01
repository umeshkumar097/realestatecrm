import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
    try {
        const { email, agencyId, planId, couponCode } = await req.json()

        if (!planId || (!email && !agencyId)) {
            return NextResponse.json({ error: "Agency ID/Email and Plan ID are required" }, { status: 400 })
        }

        // 1. Resolve Target Agency ID
        let targetAgencyId = agencyId;

        if (!targetAgencyId && email) {
            const user = await prisma.user.findUnique({
                where: { email },
                select: { agencyId: true }
            })
            if (!user?.agencyId) {
                return NextResponse.json({ error: "Registration not found for this email." }, { status: 404 })
            }
            targetAgencyId = user.agencyId;
        }

        if (!targetAgencyId) {
            return NextResponse.json({ error: "Could not resolve Agency ID" }, { status: 400 })
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
                where: { id: targetAgencyId },
                data: { planId: plan.id }
            })

            // Update Subscription Record
            await tx.subscription.upsert({
                where: { agencyId: targetAgencyId },
                update: {
                    plan: plan.name,
                    status: "ACTIVE",
                    currentPeriodEnd: new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000) // 10 years (Lifetime)
                },
                create: {
                    agencyId: targetAgencyId,
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
