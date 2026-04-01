import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { agencyId } = session.user as any
    const agency = await prisma.agency.findUnique({
        where: { id: agencyId },
        select: { stripeCustomerId: true }
    })

    if (!agency?.stripeCustomerId) {
        return NextResponse.json({ invoices: [] })
    }

    try {
        const invoices = await stripe.invoices.list({
            customer: agency.stripeCustomerId,
            limit: 12
        })

        return NextResponse.json({
            invoices: invoices.data.map(inv => ({
                id: inv.id,
                amount: inv.amount_paid,
                currency: inv.currency,
                status: inv.status,
                date: new Date(inv.created * 1000).toISOString(),
                pdf: inv.invoice_pdf,
                number: inv.number
            }))
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
