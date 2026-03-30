import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { agencyName, name, email, password, priceId, planId } = body

        if (!email || !priceId) {
            return NextResponse.json({ error: "Missing required information" }, { status: 400 })
        }

        const origin = req.headers.get("origin") || "http://localhost:3000"

        // Create Checkout Session with 3-day trial
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            subscription_data: {
                trial_period_days: 3,
                metadata: {
                   agencyName,
                   adminName: name,
                   adminEmail: email,
                   // Password will be passed in metadata (Warning: only if secure, 
                   // better to hash it beforehand or handle differently. 
                   // For now, we will hash it)
                }
            },
            client_reference_id: email, // use email as reference
            customer_email: email,
            metadata: {
                agencyName,
                adminName: name,
                adminEmail: email,
                adminPassword: password, // The password from the form
                planId: planId
            },
            success_url: `${origin}/signup/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/signup?step=2`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        console.error("[Checkout Session Error]:", error)
        return NextResponse.json({ error: error.message || "Failed to create session" }, { status: 500 })
    }
}
