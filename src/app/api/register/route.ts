import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { agencyName, email, password, name } = await req.json()

    if (!agencyName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10)

    // Create Agency and Admin User in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      const agency = await tx.agency.create({
        data: {
          name: agencyName,
        },
      })

      const user = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: "ADMIN",
          agencyId: agency.id,
        },
      })

      // Create a default subscription (basic/free trial)
      await tx.subscription.create({
          data: {
              agencyId: agency.id,
              plan: "starter",
              status: "ACTIVE",
          }
      })

      return { agency, user }
    })

    return NextResponse.json({ message: "Agency registered successfully", userId: result.user.id }, { status: 201 })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
