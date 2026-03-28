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
      description: "Perfect for small agencies",
      monthlyPrice: 1999,
      yearlyPrice: 19990,
      maxAgents: 3,
      maxLeads: 500,
      features: ["WhatsApp Integration", "Lead Management", "Basic Reports"]
    },
    {
      name: "Pro",
      description: "Best for growing teams",
      monthlyPrice: 4999,
      yearlyPrice: 49990,
      maxAgents: 10,
      maxLeads: 5000,
      features: ["Advanced AI Extraction", "Bulk Messaging", "Team Collaboration", "EMI Tracking"]
    },
    {
      name: "Enterprise",
      description: "Scale without limits",
      monthlyPrice: 9999,
      yearlyPrice: 99990,
      maxAgents: 50,
      maxLeads: 50000,
      features: ["Custom Domain", "White Labeling", "Priority Support", "Dedicated WhatsApp instance"]
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
