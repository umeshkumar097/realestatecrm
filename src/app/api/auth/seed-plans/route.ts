import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get("secret")

  if (secret !== "aiclex-master-setup-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const plans = [
    {
      name: "Starter",
      description: "Perfect for small agencies getting started.",
      monthlyPrice: 699,
      yearlyPrice: 6990,
      maxAgents: 5,
      maxLeads: 500,
      features: ["Up to 5 Agents", "500 Leads/Month", "Basic Analytics", "Email Support", "Shared WhatsApp"]
    },
    {
      name: "Professional",
      description: "For growing agencies managing 20+ deals.",
      monthlyPrice: 1099,
      yearlyPrice: 10990,
      maxAgents: 20,
      maxLeads: 999999, // Unlimited leads
      features: ["Up to 20 Agents", "Unlimited Leads", "AI Lead Scoring", "Priority Support", "Custom Reports", "Dedicated WhatsApp CRM"]
    },
    {
      name: "Enterprise",
      description: "For large property companies with multiple branches.",
      monthlyPrice: 0, // Custom pricing handled offline
      yearlyPrice: 0,
      maxAgents: 999,
      maxLeads: 999999,
      features: ["Unlimited Agents", "Multi-Branch Dashboard", "Portal Sync Integration", "API Access", "Custom Integrations", "On-premise Option"]
    }
  ]

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan
    })
  }

  // Link existing agencies to 'Starter' plan if they don't have one
  const starterPlan = await prisma.subscriptionPlan.findUnique({ where: { name: "Starter" } })
  if (starterPlan) {
    await prisma.agency.updateMany({
      where: { planId: null },
      data: { planId: starterPlan.id }
    })
  }

    return NextResponse.json({ 
      success: true, 
      message: "Subscription plans seeded successfully and agencies linked."
    })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to seed plans", details: error.message }, { status: 500 })
  }
}
