import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { agencyName, name, email, password, priceId: initialPriceId, planId } = body

        if (!email || !initialPriceId || !planId) {
            return NextResponse.json({ error: "Missing required information" }, { status: 400 })
        }

        const origin = req.headers.get("origin") || "http://localhost:3000"

        // Helper to create checkout session
        const createSession = async (currentPriceId: string) => {
            return await stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [{ price: currentPriceId, quantity: 1 }],
                subscription_data: {
                    trial_period_days: 3,
                    metadata: { agencyName, adminName: name, adminEmail: email }
                },
                client_reference_id: email,
                customer_email: email,
                metadata: { agencyName, adminName: name, adminEmail: email, adminPassword: password, planId },
                success_url: `${origin}/signup/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${origin}/signup?step=3`,
            })
        }

        try {
            const session = await createSession(initialPriceId)
            return NextResponse.json({ url: session.url })
        } catch (stripeError: any) {
            // Self-Healing: If price doesn't exist, create it in Stripe on-the-fly
            if (stripeError.message?.includes("No such price") || stripeError.code === "resource_missing") {
                console.log("[Self-Healing]: Price missing in Stripe. Creating now...")
                
                const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } })
                if (!plan) throw new Error("Plan not found in database")

                // 1. Create Product
                const product = await stripe.products.create({
                    name: `PropGoCRM: ${plan.name}`,
                    description: plan.description || `PropGoCRM ${plan.name} Plan`,
                })

                // 2. Create Price
                const price = await stripe.prices.create({
                    unit_amount: Math.round(plan.monthlyPrice * 100), // in paisa/cents
                    currency: 'inr', // matches Indian Rupee in DB
                    recurring: { interval: 'month' },
                    product: product.id,
                })

                // 3. Update DB with new real Price ID
                await (prisma as any).subscriptionPlan.update({
                    where: { id: plan.id },
                    data: { stripePriceId: price.id, stripeProductId: product.id }
                })

                // 4. Retry session creation with NEW real Price ID
                const retrySession = await createSession(price.id)
                return NextResponse.json({ url: retrySession.url })
            }
            throw stripeError
        }
    } catch (error: any) {
        console.error("[Checkout Session Error]:", error)
        return NextResponse.json({ error: error.message || "Failed to create session" }, { status: 500 })
    }
}
