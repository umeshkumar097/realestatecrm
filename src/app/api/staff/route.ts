import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sendStaffInvitationEmail, sendMemberUpdateNotification } from "@/lib/mail"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { agencyId } = session.user as any
  const staff = await prisma.user.findMany({
    where: { agencyId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json(staff)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { agencyId } = session.user as any
  const { name, email, password, role } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    // 1. Fetch Agency & Plan Limits
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

    const currentCount = agency.users.length
    const maxAgents = agency.plan?.maxAgents ?? 5

    if (currentCount >= maxAgents) {
      return NextResponse.json({ 
        error: `Plan Limit Reached: Your current plan (${agency.plan?.name || "Trial"}) allows only ${maxAgents} agents. Please upgrade to add more.` 
      }, { status: 400 })
    }

    // 2. Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. Create User (Unverified)
    const user = await (prisma.user as any).create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "AGENT",
        agencyId,
        emailVerified: null // Explicitly unverified
      }
    })

    // 4. Send Invitation Email
    await sendStaffInvitationEmail(email, name, agency.name, password)

    // 5. Notify Admin (The one who performed the action)
    if (session.user.email) {
      await sendMemberUpdateNotification(session.user.email, { name, email }, "ADDED", agency.name)
    }

    return NextResponse.json({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      message: "Agent invited! Verification email sent." 
    }, { status: 201 })
  } catch (err: any) {
    console.error("[Staff Creation Error]:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
