import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const plans = await prisma.subscriptionPlan.findMany({
            where: { stripePriceId: { not: null } }, // Only show plans ready for Stripe
            orderBy: { monthlyPrice: 'asc' }
        })
        return NextResponse.json(plans)
    } catch (error) {
        return NextResponse.json({ error: "Failed to load plans" }, { status: 500 })
    }
}
