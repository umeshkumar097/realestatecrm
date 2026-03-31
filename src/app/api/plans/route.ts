import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        let plans = await prisma.subscriptionPlan.findMany({
            orderBy: { monthlyPrice: 'asc' }
        })

        // Auto-seed if empty
        if (plans.length === 0) {
            const seedPlans = [
                {
                    name: "Starter",
                    description: "Perfect for small agencies getting started.",
                    monthlyPrice: 699,
                    yearlyPrice: 6990,
                    maxAgents: 5,
                    maxLeads: 500,
                    features: ["Up to 5 Agents", "500 Leads/Month", "Basic Analytics", "Email Support", "Shared WhatsApp"],
                    stripePriceId: "price_placeholder_starter"
                },
                {
                    name: "Professional",
                    description: "For growing agencies managing 20+ deals.",
                    monthlyPrice: 1099,
                    yearlyPrice: 10990,
                    maxAgents: 20,
                    maxLeads: 999999,
                    features: ["Up to 20 Agents", "Unlimited Leads", "AI Lead Scoring", "Priority Support", "Custom Reports", "Dedicated WhatsApp CRM"],
                    stripePriceId: "price_placeholder_pro"
                },
                {
                    name: "Enterprise",
                    description: "For large property companies with multiple branches.",
                    monthlyPrice: 0,
                    yearlyPrice: 0,
                    maxAgents: 999,
                    maxLeads: 999999,
                    features: ["Unlimited Agents", "Multi-Branch Dashboard", "Portal Sync Integration", "API Access", "Custom Integrations", "On-premise Option"],
                    stripePriceId: "price_placeholder_enterprise"
                }
            ]

            for (const plan of seedPlans) {
                await prisma.subscriptionPlan.create({ data: plan as any })
            }

            plans = await prisma.subscriptionPlan.findMany({
                orderBy: { monthlyPrice: 'asc' }
            })
        }

        return NextResponse.json(plans)
    } catch (error) {
        console.error("Plans API Error:", error)
        return NextResponse.json({ error: "Failed to load plans" }, { status: 500 })
    }
}
