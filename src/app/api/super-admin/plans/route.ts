import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    try {
        const plans = await prisma.subscriptionPlan.findMany({
            orderBy: { monthlyPrice: 'asc' }
        })
        return NextResponse.json(plans)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const plan = await prisma.subscriptionPlan.create({
            data: body
        })
        return NextResponse.json(plan)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const { id, ...data } = body
        const plan = await prisma.subscriptionPlan.update({
            where: { id },
            data
        })
        return NextResponse.json(plan)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json()
        await prisma.subscriptionPlan.delete({
            where: { id }
        })
        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
