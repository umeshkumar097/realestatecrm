import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if ((session?.user as any)?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const plans = await prisma.subscriptionPlan.findMany({
            orderBy: { monthlyPrice: 'asc' }
        })
        return NextResponse.json(plans)
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if ((session?.user as any)?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const body = await req.json()
        const { name, description, monthlyPrice, yearlyPrice, maxAgents, maxLeads, features } = body

        const plan = await prisma.subscriptionPlan.create({
            data: {
                name,
                description,
                monthlyPrice: parseFloat(monthlyPrice),
                yearlyPrice: parseFloat(yearlyPrice),
                maxAgents: parseInt(maxAgents),
                maxLeads: parseInt(maxLeads),
                features: features // Array of strings
            }
        })

        return NextResponse.json(plan)
    } catch (error: any) {
        console.error("[Plans API Error]:", error)
        return NextResponse.json({ error: error.message || "Failed to create plan" }, { status: 500 })
    }
}
