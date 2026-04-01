import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if ((session?.user as any)?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const { id } = await params;
        const { isActive, maxUses, expiresAt } = await req.json()

        const coupon = await (prisma as any).coupon.update({
            where: { id },
            data: {
                ...(isActive !== undefined && { isActive }),
                ...(maxUses !== undefined && { maxUses: parseInt(maxUses) }),
                ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null })
            }
        })

        return NextResponse.json(coupon)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if ((session?.user as any)?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const { id } = await params;
        await (prisma as any).coupon.delete({
            where: { id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 })
    }
}
