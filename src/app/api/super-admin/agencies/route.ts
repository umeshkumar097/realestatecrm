import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role

  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    // 1. Ensure Plans are Seeded
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

    const [agencies, plans] = await Promise.all([
      prisma.agency.findMany({
        include: {
          _count: {
            select: {
              users: true,
              leads: true,
              whatsappSessions: true
            }
          },
          plan: true,
          subscription: true
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.subscriptionPlan.findMany()
    ])

    return NextResponse.json({ agencies, plans })
  } catch (error: any) {
    console.error("[Superadmin Agency API Error]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const { id, status, planId, name, domain } = await req.json()
    
    const agency = await prisma.agency.update({
      where: { id },
      data: { 
        ...(status && { status }),
        ...(planId && { planId }),
        ...(name && { name }),
        ...(domain && { domain })
      }
    })

    return NextResponse.json({ success: true, agency })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update agency" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const { id } = await req.json()
    
    // Deleting agency will cascade to related models if defined in schema
    await prisma.agency.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[Agency Delete Error]:", error)
    return NextResponse.json({ error: "Failed to delete agency" }, { status: 500 })
  }
}
