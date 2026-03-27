import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/mail"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // For security, don't reveal if user exists
      return NextResponse.json({ message: "If an account exists, a reset link has been sent." })
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 3600000) // 1 hour

    // Save token
    await prisma.passwordResetToken.upsert({
      where: { email },
      update: { token, expires },
      create: { email, token, expires }
    })

    // Send email
    await sendPasswordResetEmail(email, token)

    return NextResponse.json({ message: "Reset link sent successfully" })
  } catch (error: any) {
    console.error("[Forgot Password Error]:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
