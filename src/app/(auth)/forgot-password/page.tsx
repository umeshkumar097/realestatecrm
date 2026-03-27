"use client"

import { useState } from "react"
import Link from "next/link"
import { Building2, Loader2, ArrowLeft, MailCheck } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage("Check your email for a reset link.")
      } else {
        setError(data.error || "Something went wrong")
      }
    } catch (err) {
      setError("Failed to send reset email")
    } finally {
      setLoading(false)
    }
  }

  if (message) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <MailCheck className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Email Sent!</h1>
          <p className="text-zinc-500 mb-8">{message}</p>
          <Link 
            href="/login" 
            className="flex items-center justify-center gap-2 text-primary font-bold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Building2 className="text-white h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot Password?</h1>
          <p className="text-zinc-500 text-sm mt-1 text-center">
            Enter your email and we'll send you a link to reset your password.
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
              className="w-full px-4 py-2+ rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="name@agency.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
          </button>

          <Link 
            href="/login" 
            className="flex items-center justify-center gap-2 text-zinc-500 text-sm font-medium hover:text-primary transition-colors pt-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </form>
      </div>
    </div>
  )
}
