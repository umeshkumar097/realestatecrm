import { getAgencyFromHost } from "@/lib/agency"
import DashboardClientLayout from "./DashboardClientLayout"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const agency = await getAgencyFromHost()

  if (agency && agency.subscription?.status !== "ACTIVE") {
    redirect("/portal-inactive")
  }

  return (
    <DashboardClientLayout agency={agency}>
      {children}
    </DashboardClientLayout>
  )
}
