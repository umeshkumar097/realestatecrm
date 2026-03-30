import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function POST(req: NextRequest) {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')!

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err: any) {
        console.error(`❌ Webhook signature verification failed:`, err.message)
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any
        const { agencyName, adminEmail, adminPassword, adminName, planId } = session.metadata

        console.log(`🔔 Provisioning Agency: ${agencyName} for ${adminEmail}`)

        try {
            await prisma.$transaction(async (tx) => {
                // 1. Create Agency
                const agency = await tx.agency.create({
                    data: {
                        name: agencyName,
                        planId: planId,
                        stripeCustomerId: session.customer as string,
                        stripeSubscriptionId: session.subscription as string,
                        status: 'ACTIVE',
                    },
                })

                // 2. Create Admin User
                const hashedPassword = await hash(adminPassword, 10)
                await tx.user.create({
                    data: {
                        email: adminEmail,
                        name: adminName,
                        password: hashedPassword,
                        role: 'ADMIN',
                        agencyId: agency.id,
                    },
                })

                console.log(`✅ Provisioning Complete for ${agencyName}`)
            })
        } catch (error) {
            console.error(`❌ Provisioning Failed:`, error)
            // Note: Stripe will retry if we return 500
            return NextResponse.json({ error: "Failed to provision agency" }, { status: 500 })
        }
    }

    // Handle customer.subscription.deleted
    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as any
        
        await prisma.agency.update({
            where: { stripeSubscriptionId: subscription.id },
            data: { status: 'SUSPENDED' }
        })
        
        console.log(`🛑 Agency Suspended: ${subscription.id}`)
    }

    return NextResponse.json({ received: true })
}

// NextJS edge runtime config if needed
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }
