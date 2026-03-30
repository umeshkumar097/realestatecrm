import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if ((session?.user as any)?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    try {
        const body = await req.json()
        const { name, description, monthlyPrice, yearlyPrice, maxAgents, maxLeads, features } = body

        const plan = await prisma.subscriptionPlan.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(monthlyPrice !== undefined && { monthlyPrice: parseFloat(monthlyPrice) }),
                ...(yearlyPrice !== undefined && { yearlyPrice: parseFloat(yearlyPrice) }),
                ...(maxAgents !== undefined && { maxAgents: parseInt(maxAgents) }),
                ...(maxLeads !== undefined && { maxLeads: parseInt(maxLeads) }),
                ...(features && { features })
            }
        })

        return NextResponse.json(plan)
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to update plan" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if ((session?.user as any)?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    try {
        // Caution: Deleting a plan might affect agencies assigned to it
        // We should handle this (either set to null or prevent delete)
        await prisma.subscriptionPlan.delete({
            where: { id }
        })
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to delete plan. Ensure no agencies are using it." }, { status: 500 })
    }
}
