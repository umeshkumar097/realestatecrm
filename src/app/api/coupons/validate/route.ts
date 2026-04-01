import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
    try {
        const { code } = await req.json()

        if (!code) {
            return NextResponse.json({ error: "Coupon code is required" }, { status: 400 })
        }

        const coupon = await (prisma as any).coupon.findUnique({
            where: { code: code.toUpperCase() },
            include: { plan: true }
        })

        if (!coupon || !coupon.isActive) {
            return NextResponse.json({ error: "Invalid or inactive coupon code" }, { status: 404 })
        }

        if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
            return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 })
        }

        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
            return NextResponse.json({ error: "Coupon has expired" }, { status: 400 })
        }

        return NextResponse.json({
            message: "Coupon validated",
            plan: coupon.plan
        })
    } catch (error: any) {
        console.error("[Coupon Validation Error]:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
