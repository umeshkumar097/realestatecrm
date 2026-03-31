import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { syncLeadToGoogleSheets } from "@/lib/integrations/google-sheets"

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ agencyId: string }> }
) {
    const { agencyId } = await params
    const apiKey = req.headers.get("x-webhook-secret") || req.nextUrl.searchParams.get("secret")

    if (!apiKey) {
        return NextResponse.json({ error: "Missing webhook secret" }, { status: 401 })
    }

    try {
        const config = await prisma.webhookConfig.findFirst({
            where: { agencyId, secret: apiKey, isActive: true }
        })

        if (!config) {
            return NextResponse.json({ error: "Invalid or inactive webhook secret" }, { status: 403 })
        }

        const body = await req.json()

        // Smart Mapping: Try to find common lead fields in the incoming JSON
        const name = body.name || body.full_name || body.fullName || body.customer_name
        const email = body.email || body.email_address || body.emailAddress
        const phone = body.phone || body.phone_number || body.phoneNumber || body.mobile
        const budget = body.budget || body.price_range || body.priceRange
        const location = body.location || body.city || body.address
        const propertyType = body.property_type || body.propertyType || body.interest
        const notes = body.notes || body.message || body.comments

        if (!phone) {
            return NextResponse.json({ error: "Phone number is required for lead creation" }, { status: 400 })
        }

        // Create or update lead
        const lead = await prisma.lead.upsert({
            where: { 
                phone_agencyId: {
                    phone: phone.toString(),
                    agencyId
                }
            },
            update: {
                name: name || undefined,
                email: email || undefined,
                budget: budget?.toString() || undefined,
                location: location || undefined,
                notes: notes || undefined,
                propertyType: propertyType || undefined,
                updatedAt: new Date()
            },
            create: {
                name: name || "Webhook Lead",
                email: email || "",
                phone: phone.toString(),
                budget: budget?.toString() || "",
                location: location || "",
                notes: notes || "Added via Webhook",
                propertyType: propertyType || "",
                agencyId
            }
        })

        // Log activity
        await prisma.activity.create({
            data: {
                type: "WEBHOOK_SYNC",
                content: `Lead ${lead.name} synced via ${config.name}`,
                leadId: lead.id,
                agencyId,
                userId: (await prisma.user.findFirst({ where: { agencyId, role: "AGENCY_OWNER" } }))?.id || ""
            }
        })

        // ASYNC: Sync to Google Sheets if connected
        syncLeadToGoogleSheets(lead).catch(err => console.error("Sheets Async Sync failed:", err))

        return NextResponse.json({ success: true, leadId: lead.id })
    } catch (error: any) {
        console.error("Webhook Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
