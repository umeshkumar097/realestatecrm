import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

export interface AgencyWithSubscription {
  id: string
  name: string
  logo: string | null
  domain: string | null
  customDomain: string | null
  subscription?: {
    status: string
    plan: string
  } | null
}

export async function getAgencyFromHost(): Promise<AgencyWithSubscription | null> {
  const headerList = await headers()
  const subdomain = headerList.get("x-agency-subdomain")
  const customDomain = headerList.get("x-agency-custom-domain")

  if (!subdomain && !customDomain) return null

  // Build filters dynamically to avoid empty values in OR array (Prisma validation)
  const filters: any[] = []
  if (customDomain) filters.push({ customDomain })
  if (subdomain) {
    filters.push({ domain: subdomain })
    filters.push({ domain: { startsWith: subdomain + "." } })
  }

  if (filters.length === 0) return null

  // Resolve agency
  const agency = await (prisma.agency as any).findFirst({
    where: {
      OR: filters
    },
    select: {
      id: true,
      name: true,
      logo: true,
      domain: true,
      customDomain: true,
      subscription: {
        select: {
          status: true,
          plan: true,
        }
      }
    }
  })

  return agency as AgencyWithSubscription | null
}
