import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId } = session.user as any
  if (!agencyId) return NextResponse.json({ error: "No agency assigned" }, { status: 400 })

  const properties = await prisma.property.findMany({
    where: { agencyId },
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json(properties)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { agencyId } = session.user as any
  const body = await req.json()
  const { title, description, price, type, location, address, city, state, zip, images, beds, baths, area } = body

  if (!title || !price) {
    return NextResponse.json({ error: "Title and Price are required" }, { status: 400 })
  }

  const property = await prisma.property.create({
    data: {
      title,
      description,
      price: parseFloat(price),
      type,
      address: address || location || "N/A",
      city: city || "N/A",
      state: state || "N/A",
      zip: zip || "N/A",
      beds: beds ? parseInt(beds) : null,
      baths: baths ? parseFloat(baths) : null,
      area: area ? parseFloat(area) : null,
      images: images || [],
      agencyId
    }
  })

  return NextResponse.json(property, { status: 201 })
}
