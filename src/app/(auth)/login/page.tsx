import { getAgencyFromHost } from "@/lib/agency"
import LoginForm from "./LoginForm"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const agency = await getAgencyFromHost()

  if (agency && agency.subscription?.status !== "ACTIVE") {
    redirect("/portal-inactive")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <LoginForm agency={agency} />
    </div>
  )
}
