import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { agencyId } = session.user as any
    const agency = await prisma.agency.findUnique({
        where: { id: agencyId },
        select: { stripeCustomerId: true }
    })

    if (!agency?.stripeCustomerId) {
        return NextResponse.json({ error: "No billing profile found. Please subscribe to a plan first." }, { status: 400 })
    }

    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: agency.stripeCustomerId,
            return_url: `${process.env.NEXTAUTH_URL}/dashboard/billing`,
        })

        return NextResponse.json({ url: portalSession.url })
    } catch (error: any) {
        console.error("Stripe Portal Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
