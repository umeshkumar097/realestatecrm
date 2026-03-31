import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.agencyId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const config = await prisma.webhookConfig.findFirst({
        where: { agencyId: session.user.agencyId, isActive: true }
    })

    return NextResponse.json({ config })
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.agencyId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const config = await prisma.webhookConfig.upsert({
        where: { id: (await prisma.webhookConfig.findFirst({ where: { agencyId: session.user.agencyId } }))?.id || 'new' },
        update: { isActive: true },
        create: {
            agencyId: session.user.agencyId,
            name: "Main Webhook",
            isActive: true
        }
    })

    return NextResponse.json({ config })
}
