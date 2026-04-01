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
        // 1. Fetch Stripe Invoices
        let stripeInvoices: any[] = []
        if (agency.stripeCustomerId) {
            const invoices = await stripe.invoices.list({
                customer: agency.stripeCustomerId,
                limit: 12
            })
            stripeInvoices = invoices.data.map((inv: any) => ({
                id: inv.id,
                amount: inv.amount_paid,
                currency: inv.currency,
                status: inv.status,
                date: new Date(inv.created * 1000).toISOString(),
                pdf: inv.invoice_pdf,
                number: inv.number,
                source: "STRIPE"
            }))
        }

        // 2. Fetch Platform Invoices (Aiclex Technologies)
        const platformInvoices = await (prisma as any).platformInvoice.findMany({
            where: { agencyId },
            orderBy: { generatedAt: "desc" }
        })

        const mappedPlatform = platformInvoices.map((inv: any) => ({
            id: inv.id,
            amount: Math.round(inv.amount * 100), // convert to cents for frontend consistency
            currency: "inr",
            status: inv.status.toLowerCase(),
            date: inv.generatedAt.toISOString(),
            pdf: `/dashboard/billing/invoice/${inv.id}`, // Custom link to our viewer
            number: inv.invoiceNumber,
            source: "PLATFORM"
        }))

        // 3. Converge and Sort
        const allInvoices = [...stripeInvoices, ...mappedPlatform].sort((a: any, b: any) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )

        return NextResponse.json({
            invoices: allInvoices
        })
    } catch (error: any) {
        console.error("[Invoices Merge Error]:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
