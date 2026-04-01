"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Building2, Loader2 } from "lucide-react"

interface LoginFormProps {
  agency: {
    name: string;
    logo: string | null;
  } | null;
}

export default function LoginForm({ agency }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        if (res.error === "VERIFY_EMAIL") {
          router.push(`/verify-email?email=${encodeURIComponent(email)}`)
        } else if (res.error === "ACCOUNT_SUSPENDED") {
          setError(`Your account has been suspended by ${agency?.name || "your company"}. Please contact support.`)
        } else {
          setError("Invalid email or password")
        }
      } else {
        // Fetch session to get user role for proper redirection
        const sessionRes = await fetch("/api/auth/session")
        const session = await sessionRes.json()
        
        if (session?.user?.role === "SUPER_ADMIN") {
          router.push("/super-admin")
        } else {
          router.push("/dashboard")
        }
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20 overflow-hidden">
          {agency?.logo ? (
             <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="text-white h-7 w-7" />
          )}
        </div>
        <h1 className="text-2xl font-bold">{agency?.name || "Welcome Back"}</h1>
        <p className="text-zinc-500 text-sm mt-1 text-center">
            {agency ? `Log in to ${agency.name} portal` : "Enter your credentials to access your agency dashboard."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="name@agency.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">Forgot?</Link>
          </div>
          <input
            type="password"
            required
            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
        </button>
      </form>

      {!agency && (
        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <p className="text-zinc-500 text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary font-bold hover:underline">Create Agency</Link>
            </p>
        </div>
      )}
    </div>
  )
}
