import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        let plans = await prisma.subscriptionPlan.findMany({
            orderBy: { monthlyPrice: 'asc' }
        })

        // Auto-seed if empty
        const seedPlans = [
            {
                name: "Starter",
                description: "Perfect for small agencies getting started.",
                monthlyPrice: 699,
                yearlyPrice: 6990,
                maxAgents: 5,
                maxLeads: 500,
                features: ["Up to 5 Agents", "500 Leads/Month", "Basic Analytics", "Email Support", "Shared WhatsApp"],
                stripePriceId: "price_starter_699",
                isPublic: true
            },
            {
                name: "Professional",
                description: "For growing agencies managing 20+ deals.",
                monthlyPrice: 1099,
                yearlyPrice: 10990,
                maxAgents: 20,
                maxLeads: 999999,
                features: ["Up to 20 Agents", "Unlimited Leads", "AI Lead Scoring", "Priority Support", "Custom Reports", "Dedicated WhatsApp CRM"],
                stripePriceId: "price_pro_1099",
                isPublic: true
            },
            {
                name: "Enterprise",
                description: "For large property companies with multiple branches.",
                monthlyPrice: 0,
                yearlyPrice: 0,
                maxAgents: 999,
                maxLeads: 999999,
                features: ["Unlimited Agents", "Multi-Branch Dashboard", "Portal Sync Integration", "API Access", "Custom Integrations", "On-premise Option"],
                stripePriceId: "price_enterprise_custom",
                isPublic: true
            },
            {
                name: "Lifetime Member",
                description: "Special lifetime access with Starter features.",
                monthlyPrice: 0,
                yearlyPrice: 0,
                maxAgents: 5,
                maxLeads: 500,
                features: ["Up to 5 Agents", "500 Leads/Month", "Basic Analytics", "Email Support", "Shared WhatsApp"],
                stripePriceId: "price_lifetime_admin",
                isPublic: false
            }
        ]

        for (const plan of seedPlans) {
            await (prisma as any).subscriptionPlan.upsert({
                where: { name: plan.name },
                update: { 
                    stripePriceId: plan.stripePriceId,
                    isPublic: plan.isPublic,
                    maxAgents: plan.maxAgents,
                    maxLeads: plan.maxLeads,
                    features: plan.features
                },
                create: plan
            })
        }

        plans = await (prisma.subscriptionPlan as any).findMany({
            where: { isPublic: true },
            orderBy: { monthlyPrice: 'asc' }
        })

        return NextResponse.json(plans)
    } catch (error) {
        console.error("Plans API Error:", error)
        return NextResponse.json({ error: "Failed to load plans" }, { status: 500 })
    }
}
