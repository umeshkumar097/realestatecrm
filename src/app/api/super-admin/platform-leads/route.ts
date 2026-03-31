import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const leads = await prisma.platformLead.findMany({
            orderBy: { createdAt: "desc" }
        })
        return NextResponse.json({ leads })
    } catch (error) {
        console.error("[Platform Leads Fetch Error]:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { id } = await req.json()
        await prisma.platformLead.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    try {
        const { id, status } = await req.json()
        await prisma.platformLead.update({ 
            where: { id },
            data: { status }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 })
    }
}
