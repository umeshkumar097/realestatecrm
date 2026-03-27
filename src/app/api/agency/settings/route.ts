import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { agencyId } = session.user as any
  const agency = await prisma.agency.findUnique({
    where: { id: agencyId },
    select: {
      id: true,
      name: true,
      domain: true,
      customDomain: true,
      logo: true,
      subscription: {
        select: {
          status: true,
          plan: true,
        }
      }
    }
  })

  return NextResponse.json(agency)
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { agencyId } = session.user as any
  const body = await req.json()
  const { name, domain, customDomain, logo } = body

  // Fetch current agency to check plan for custom domain
  const currentAgency = await prisma.agency.findUnique({
    where: { id: agencyId },
    include: { subscription: true }
  })

  // Enterprise Check for Custom Domain
  if (customDomain && customDomain !== currentAgency?.customDomain) {
    const isEnterprise = currentAgency?.subscription?.plan === "ENTERPRISE"
    const isActive = currentAgency?.subscription?.status === "ACTIVE"
    
    if (!isEnterprise || !isActive) {
      return NextResponse.json({ 
        error: "Custom domains are exclusive to the Enterprise Plan with an active subscription." 
      }, { status: 403 })
    }

    // Check custom domain uniqueness
    const existing = await prisma.agency.findUnique({
      where: { customDomain }
    })
    if (existing && existing.id !== agencyId) {
      return NextResponse.json({ error: "This custom domain is already registered." }, { status: 400 })
    }
  }

  // If internal subdomain is being updated, check for uniqueness
  if (domain && domain !== currentAgency?.domain) {
    const existingSubdomain = await prisma.agency.findUnique({
      where: { domain }
    })
    if (existingSubdomain && existingSubdomain.id !== agencyId) {
      return NextResponse.json({ error: "Subdomain already in use by another agency" }, { status: 400 })
    }
  }

  const updated = await prisma.agency.update({
    where: { id: agencyId },
    data: {
      name,
      domain,
      customDomain,
      logo
    }
  })

  return NextResponse.json(updated)
}
