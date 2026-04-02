import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/prisma"
import { hash } from "bcryptjs"
import { sendEmail, emailWrapper } from "@/lib/mail"
import crypto from "crypto"

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
            const result = await (prisma as any).$transaction(async (tx: any) => {
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
                
                // 3. Generate Verification Token
                const token = crypto.randomInt(100000, 999999).toString()
                const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

                await tx.verificationToken.create({
                    data: {
                        email: adminEmail,
                        token,
                        expires,
                    },
                })

                console.log(`✅ Provisioning Complete for ${agencyName}`)
                return { token }
            })

            // 4. Send Emails (Outside transaction for speed)
            const verificationHtml = emailWrapper(`
              <p>Hello ${adminName},</p>
              <p>Thank you for choosing Master Real Estate Matrix! Your professional agency space <strong>${agencyName}</strong> is ready.</p>
              <p>To activate your account and access the dashboard, please use this verification code:</p>
              <div style="background: #f1f5f9; padding: 24px; border-radius: 16px; text-align: center; margin: 32px 0;">
                <span style="font-size: 32px; font-weight: 900; letter-spacing: 0.2em; color: #2563eb;">${result.token}</span>
              </div>
              <p>Welcome aboard!</p>
            `, "Verify your Master Real Estate Matrix Agency")

            await sendEmail({
              to: adminEmail,
              subject: "Action Required: Verify your Master Real Estate Matrix Account",
              html: verificationHtml,
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
