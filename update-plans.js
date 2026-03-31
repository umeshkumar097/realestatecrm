const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small agencies getting started.',
      monthlyPrice: 699,
      yearlyPrice: 6990,
      maxAgents: 5,
      maxLeads: 500,
      features: ["Up to 5 Agents", "500 Leads/Month", "Basic Analytics", "Email Support"]
    },
    {
      name: 'Professional',
      description: 'For growing agencies managing 20+ deals.',
      monthlyPrice: 1099,
      yearlyPrice: 10990,
      maxAgents: 20,
      maxLeads: 5000,
      features: ["Up to 20 Agents", "Unlimited Leads", "AI Lead Scoring", "Priority Support", "Custom Reports", "WhatsApp Integration"]
    },
    {
      name: 'Enterprise',
      description: 'For large property companies with multiple branches.',
      monthlyPrice: 0, // Custom
      yearlyPrice: 0,
      maxAgents: 999,
      maxLeads: 999999,
      features: ["Unlimited Agents", "Multi-Branch Dashboard", "Dedicated Account Manager", "API Access", "Custom Integrations", "On-premise Option"]
    }
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }

  console.log('✅ Subscription plans updated/created successfully');
}

main()
  .catch(e => {
    console.error('❌ Error updating plans:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
