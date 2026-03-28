import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
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

  console.log("Seeding Subscription Plans...")

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

  console.log("Seeding COMPLETE!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
