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
        const coupons = await (prisma as any).coupon.findMany({
            include: { plan: true },
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json(coupons)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if ((session?.user as any)?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const { code, planId, maxUses, expiresAt } = await req.json()

        if (!code || !planId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const coupon = await (prisma as any).coupon.create({
            data: {
                code: code.toUpperCase(),
                planId,
                maxUses: parseInt(maxUses) || 1,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                isActive: true
            }
        })

        return NextResponse.json(coupon)
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 })
    }
}
