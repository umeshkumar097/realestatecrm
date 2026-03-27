"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Building2, Loader2, Lock, ShieldCheck, AlertCircle } from "lucide-react"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      return setError("Passwords do not match")
    }

    if (password.length < 8) {
      return setError("Password must be at least 8 characters long")
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("Password updated successfully! Redirecting to login...")
        setTimeout(() => router.push("/login"), 3000)
      } else {
        setError(data.error || "Failed to reset password")
      }
    } catch (err) {
      setError("Failed to process request")
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Invalid Link</h1>
        <p className="text-zinc-500 mb-8">This password reset link is missing or malformed.</p>
        <Link href="/login" className="text-primary font-bold hover:underline">Back to Login</Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
          <Lock className="text-white h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">Set New Password</h1>
        <p className="text-zinc-500 text-sm mt-1 text-center">
          Choose a strong password for your agency portal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> {message}
          </div>
        )}
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">New Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2+ rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Confirm Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2+ rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !!message}
          className="w-full py-2.5 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
