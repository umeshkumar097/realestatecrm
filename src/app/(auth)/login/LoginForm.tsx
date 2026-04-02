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
    <div className="w-full max-w-lg bg-white/40 backdrop-blur-2xl rounded-[60px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-white p-12 relative animate-in zoom-in-95 duration-700">
      <div className="absolute top-0 right-0 p-32 -mr-16 -mt-16 bg-blue-600/5 rounded-full blur-[80px] -z-10" />
      
      <div className="flex flex-col items-center mb-12">
        <div className="w-24 h-24 bg-slate-900 rounded-[32px] flex items-center justify-center mb-6 shadow-2xl shadow-slate-900/20 overflow-hidden border-4 border-white">
          {agency?.logo ? (
             <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="text-white h-10 w-10 italic" />
          )}
        </div>
        <div className="text-center space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">{agency?.name || "Master Matrix Ingress"}</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">
                {agency ? `Authorizing Node: ${agency.name}` : "Private Intelligence Vault Access"}
            </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-[20px] text-rose-600 text-[10px] font-black uppercase tracking-[0.2em] italic animate-in shake duration-500">
            Resolve Error: {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em]">Operational Node ID (Email)</label>
          <input
            type="email"
            required
            className="w-full px-8 py-5 rounded-[32px] border border-slate-50 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all"
            placeholder="node.ingress@matrix.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black uppercase text-slate-400 italic tracking-[0.2em]">Access Key (Password)</label>
            <Link href="/forgot-password" hidden className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline italic">Forgot Key?</Link>
          </div>
          <input
            type="password"
            required
            className="w-full px-8 py-5 rounded-[32px] border border-slate-50 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-6 bg-slate-900 text-white rounded-[32px] text-[11px] font-black uppercase tracking-[0.4em] italic shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>Authorize Ingress ⚡</>}
        </button>
      </form>

      {!agency && (
        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic">
                Zero Node Presence?{" "}
                <Link href="/signup" className="text-blue-600 font-black hover:underline ml-2">Initialize Agency Matrix</Link>
            </p>
        </div>
      )}
    </div>
  )
}
