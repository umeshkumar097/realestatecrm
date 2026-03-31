"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ShieldCheck, ArrowRight, Loader2, Mail, CheckCircle2 } from "lucide-react"
import Logo from "@/components/Logo"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) setEmail(emailParam)
  }, [searchParams])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Verification failed")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/login?verified=true")
      }, 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={44} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Account Verified!</h1>
        <p className="text-lg text-slate-500 font-medium max-w-sm mx-auto">
          Your PropGoCRM account is now active. Redirecting you to login...
        </p>
        <div className="pt-8">
           <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-12">
        <Logo className="justify-center mb-8" />
        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic mb-4">Verify your email.</h1>
        <p className="text-slate-500 font-medium">
          We've sent a 6-digit code to <span className="text-blue-600 font-bold">{email || "your email"}</span>.
        </p>
      </div>

      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-blue-900/5 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Verification Code</label>
            <input
              type="text"
              placeholder="000000"
              maxLength={6}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[24px] text-3xl font-black tracking-[1em] text-center transition-all outline-none placeholder:text-slate-200"
              required
            />
          </div>

          {error && (
            <div className="px-6 py-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 border border-red-100">
              <ShieldCheck size={18} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || token.length !== 6}
            className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-3"
          >
            Verify Account <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-bold italic">
            Didn't get the code? <button className="text-blue-600 hover:underline">Resend Email</button>
          </p>
        </div>
      </div>

      <p className="mt-12 text-center text-sm text-slate-400 font-medium">
        Back to <Link href="/login" className="text-slate-600 font-bold hover:underline">Login</Link>
      </p>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] flex items-center justify-center p-6 selection:bg-blue-100 selection:text-blue-900">
      <Suspense fallback={<Loader2 className="w-10 h-10 text-blue-600 animate-spin" />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}
