import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sendStaffInvitationEmail, sendMemberUpdateNotification } from "@/lib/mail"

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { agencyId } = session.user as any
    const { staff } = await req.json()

    if (!staff || !Array.isArray(staff) || staff.length === 0) {
        return NextResponse.json({ error: "Invalid staff data provided" }, { status: 400 })
    }

    try {
        const agency = await prisma.agency.findUnique({
            where: { id: agencyId },
            include: { 
                plan: true,
                users: { select: { id: true } }
            }
        })

        if (!agency) {
            return NextResponse.json({ error: "Agency not found" }, { status: 404 })
        }

        const maxAgents = agency.plan?.maxAgents ?? 5
        const currentCount = agency.users.length
        
        if (currentCount + staff.length > maxAgents) {
            return NextResponse.json({ 
                error: `Limit reached. Your plan allows only ${maxAgents} agents. You have ${currentCount} and are trying to add ${staff.length}.` 
            }, { status: 400 })
        }

        const results = []
        for (const s of staff) {
            if (!s.name || !s.email || !s.password) continue
            
            const existing = await prisma.user.findUnique({ where: { email: s.email } })
            if (existing) {
                results.push({ email: s.email, status: "error", message: "Email already exists" })
                continue
            }

            const hashedPassword = await bcrypt.hash(s.password, 10)
            const user = await (prisma.user as any).create({
                data: {
                    name: s.name,
                    email: s.email,
                    password: hashedPassword,
                    role: s.role || "AGENT",
                    agencyId,
                    emailVerified: null
                }
            })

            await sendStaffInvitationEmail(s.email, s.name, agency.name, s.password)
            if (session.user.email) {
                await sendMemberUpdateNotification(session.user.email, { name: s.name, email: s.email }, "ADDED", agency.name)
            }
            results.push({ email: s.email, status: "success" })
        }

        return NextResponse.json({ results })
    } catch (error: any) {
        console.error("[Bulk Staff Error]:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
