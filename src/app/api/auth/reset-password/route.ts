import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcrypt"

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    // Find valid token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!resetToken || resetToken.expires < new Date()) {
       return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email }
    })

    if (!user) {
       return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Hash new password
    const hashedPassword = await hash(password, 10)

    // Update user and delete token in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      })
    ])

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error: any) {
    console.error("[Reset Password Error]:", error)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}
