import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const { status, notes } = await req.json()

  console.log(`[PATCH Lead] ID: ${id}, Status: ${status}, Agency: ${session.user.agencyId}`)

  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: { 
        ...(status && { status }),
        ...(notes && { notes })
      }
    })
    console.log(`[PATCH Lead] Success for ${id}`)
    return NextResponse.json(lead)
  } catch (error: any) {
    console.error(`[PATCH Lead] Error: ${error.message}`)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  try {
    await prisma.lead.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
