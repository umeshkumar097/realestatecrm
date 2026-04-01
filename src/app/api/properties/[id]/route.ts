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
  const { agencyId } = session.user as any
  const body = await req.json()
  const { title, price, location, type, beds, baths, area, status } = body

  try {
    const property = await prisma.property.update({
      where: { id, agencyId },
      data: { 
        ...(title && { title }),
        ...(price && { price: parseFloat(price) }),
        ...(location && { address: location }),
        ...(type && { type }),
        ...(beds && { beds: parseInt(beds) }),
        ...(baths && { baths: parseFloat(baths) }),
        ...(area && { area: parseFloat(area) }),
        ...(status && { status })
      }
    })
    return NextResponse.json(property)
  } catch (error: any) {
    return NextResponse.json({ error: "Property not found or access denied" }, { status: 404 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const { agencyId } = session.user as any

  try {
    await prisma.property.delete({ where: { id, agencyId } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete property or access denied" }, { status: 404 })
  }
}
