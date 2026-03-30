import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

import { stripe } from "@/lib/stripe"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if ((session?.user as any)?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const plans = await prisma.subscriptionPlan.findMany({
            orderBy: { monthlyPrice: 'asc' }
        })
        return NextResponse.json(plans)
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if ((session?.user as any)?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const body = await req.json()
        const { name, description, monthlyPrice, yearlyPrice, maxAgents, maxLeads, features } = body

        // 1. Create Product in Stripe
        const product = await stripe.products.create({
            name,
            description: description || `Plan with ${maxAgents} agents and ${maxLeads} leads`,
            metadata: { maxAgents, maxLeads }
        })

        // 2. Create Monthly Price in Stripe
        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: Math.round(parseFloat(monthlyPrice) * 100), // convert to cents/paise
            currency: 'inr',
            recurring: { interval: 'month' },
        })

        // 3. Save to DB
        const plan = await prisma.subscriptionPlan.create({
            data: {
                name,
                description,
                monthlyPrice: parseFloat(monthlyPrice),
                yearlyPrice: parseFloat(yearlyPrice),
                maxAgents: parseInt(maxAgents),
                maxLeads: parseInt(maxLeads),
                features: features,
                stripeProductId: product.id,
                stripePriceId: price.id
            }
        })

        return NextResponse.json(plan)
    } catch (error: any) {
        console.error("[Plans API Error]:", error)
        return NextResponse.json({ error: error.message || "Failed to create plan" }, { status: 500 })
    }
}
