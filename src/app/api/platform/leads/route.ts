import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPlatformLeadNotification } from "@/lib/mail"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, email, phone, company, message, plan } = body

        if (!name || !email || !phone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // 1. Save to Database
        const lead = await prisma.platformLead.create({
            data: {
                name,
                email,
                phone,
                company,
                message,
                plan: plan || "Enterprise",
                status: "NEW"
            }
        })

        // 2. Send Notifications
        try {
            await sendPlatformLeadNotification({ name, email, phone, company, message, plan: plan || "Enterprise" })
        } catch (mailError) {
            console.error("[Mail Error]:", mailError)
            // Still return success as the lead is saved
        }

        return NextResponse.json({ success: true, leadId: lead.id })
    } catch (error: any) {
        console.error("[Platform Lead API Error]:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function GET() {
    // Only for testing or super-admin
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
