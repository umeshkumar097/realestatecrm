import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { agencyId } = session.user as any
    const { gstNumber, billingAddress, billingEmail } = await req.json()

    try {
        const updated = await (prisma as any).agency.update({
            where: { id: agencyId },
            data: {
                gstNumber,
                billingAddress,
                billingEmail
            }
        })

        return NextResponse.json(updated)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
