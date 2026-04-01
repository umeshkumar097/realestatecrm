"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Building2, Loader2, CheckCircle2, ChevronRight, Sparkles, IndianRupee, Users, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [plans, setPlans] = useState<any[]>([])
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    agencyName: "",
    name: "",
    email: "",
    password: "",
  })
  const [token, setToken] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [couponPlan, setCouponPlan] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (step === 3) {
      setLoading(true)
      fetch("/api/plans").then(res => res.json()).then(p => {
        setPlans(p)
        setLoading(false)
      })
    }
  }, [step])

  const handleApplyCoupon = async () => {
    if (!couponCode) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Invalid coupon")
      
      setCouponPlan(data.plan)
      setSelectedPlan(data.plan)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Registration failed")
      
      setStep(2)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, token }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Verification failed")
      
      setStep(3)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStartTrial = async () => {
    if (!selectedPlan) {
        setError("Please select a plan to continue.")
        return
    }
    
    if (selectedPlan.name === "Enterprise" && !couponPlan) {
        router.push("/contact?plan=enterprise")
        return
    }

    setLoading(true)
    setError("")

    try {
      if (couponPlan?.id === selectedPlan.id || selectedPlan.monthlyPrice === 0) {
        console.log("[Bypass]: Activating plan via Coupon/Lifetime logic...")
        const res = await fetch("/api/super-admin/agencies/upgrade-manual", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email: formData.email, 
                planId: selectedPlan.id,
                couponCode: couponPlan?.code 
            }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to activate plan")
        router.push("/signup/success?plan=" + selectedPlan.name)
        return
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          priceId: selectedPlan.stripePriceId,
          planId: selectedPlan.id
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create checkout")

      window.location.href = data.url
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 selection:bg-blue-100 selection:text-blue-900 font-inter">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-center gap-2 mb-10">
            <div className={cn("w-3 h-3 rounded-full transition-all duration-700", step >= 1 ? "bg-primary" : "bg-zinc-200")} />
            <div className={cn("w-12 h-1 bg-zinc-200 rounded-full", step >= 2 ? "bg-primary" : "bg-zinc-200")} />
            <div className={cn("w-3 h-3 rounded-full transition-all duration-700", step >= 2 ? "bg-primary" : "bg-zinc-200")} />
            <div className={cn("w-12 h-1 bg-zinc-200 rounded-full", step >= 3 ? "bg-primary" : "bg-zinc-200")} />
            <div className={cn("w-3 h-3 rounded-full transition-all duration-700", step >= 3 ? "bg-primary" : "bg-zinc-200")} />
        </div>

        {step === 1 ? (
          <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl border border-zinc-200 dark:border-zinc-800 p-12">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-4">
                <Building2 className="h-10 w-10" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Your Agency OS.</h1>
              <p className="text-zinc-500 text-sm mt-1 text-center font-medium">Verify your email to unlock packages.</p>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold text-center">{error}</div>}

            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Agency Identity</label>
                <input required className="w-full px-8 py-5 rounded-[24px] border border-zinc-100 bg-zinc-50 focus:ring-2 focus:ring-primary outline-none transition-all font-bold" placeholder="Elite Realty Firm" value={formData.agencyName} onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Full Name</label>
                <input required className="w-full px-8 py-5 rounded-[24px] border border-zinc-100 bg-zinc-50 focus:ring-2 focus:ring-primary outline-none transition-all font-bold" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Work Email</label>
                <input type="email" required className="w-full px-8 py-5 rounded-[24px] border border-zinc-100 bg-zinc-50 focus:ring-2 focus:ring-primary outline-none transition-all font-bold" placeholder="john@agency.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Secure Password</label>
                <input type="password" required className="w-full px-8 py-5 rounded-[24px] border border-zinc-100 bg-zinc-50 focus:ring-2 focus:ring-primary outline-none transition-all font-bold" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <button disabled={loading} type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[24px] font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-8 uppercase tracking-widest text-xs">
                {loading ? <Loader2 className="h-5 w-5 animate-spin"/> : <>Send Verification Code <ChevronRight className="h-5 w-5" /></>}
              </button>
            </form>
          </div>
        ) : step === 2 ? (
          <div className="w-full max-w-md mx-auto bg-white rounded-[40px] shadow-2xl border border-zinc-200 p-12 text-center animate-in zoom-in-95 duration-500">
             <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 tracking-tighter font-black text-2xl shadow-xl shadow-blue-500/10">
                OTP
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Validate Your Email.</h1>
             <p className="text-slate-500 text-sm font-medium mb-10">We've sent a 6-digit code to <span className="text-blue-600 font-bold">{formData.email}</span>.</p>
             
             {error && <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold">{error}</div>}

             <form onSubmit={handleVerifyToken} className="space-y-8">
               <div className="space-y-2 text-left">
                 <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Enter 6-Digit Code</label>
                 <input required maxLength={6} placeholder="000000" className="w-full px-8 py-5 bg-zinc-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-[24px] text-3xl font-black tracking-[1em] text-center transition-all outline-none" value={token} onChange={(e) => setToken(e.target.value)} />
               </div>
               
               <button disabled={loading || token.length !== 6} type="submit" className="w-full py-6 bg-primary text-white rounded-[24px] font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3">
                 {loading ? <Loader2 className="h-5 w-5 animate-spin"/> : <>Verify & Review Packages <ChevronRight className="h-5 w-5" /></>}
               </button>
             </form>
             
             <button onClick={() => setStep(1)} className="mt-8 text-xs font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-600">Incorrect Email? Edit Details</button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="text-center mb-8">
                <h2 className="text-4xl lg:text-7xl font-black tracking-tighter text-slate-900 mb-2 leading-none uppercase italic">Choose Your Package.</h2>
                <div className="flex flex-col items-center gap-4">
                    <p className="text-slate-500 font-bold uppercase tracking-[0.25em] text-xs flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-500" /> Start with a 3-day full access trial
                    </p>
                    
                    <div className="flex items-center gap-2 mt-4 bg-white border border-zinc-200 rounded-full pl-6 pr-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary transition-all">
                         <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Gift Code:</span>
                         <input 
                            className="bg-transparent border-none outline-none font-bold text-sm w-32 placeholder:text-zinc-300"
                            placeholder="PROMO2026"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                         />
                         <button 
                            onClick={handleApplyCoupon}
                            disabled={loading || !couponCode}
                            className="px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-30"
                         >
                            Apply
                         </button>
                    </div>
                    {couponPlan && (
                        <div className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100 animate-in slide-in-from-top-2">
                            <CheckCircle2 className="h-3 w-3" /> Activated: {couponPlan.name} (Bypassing Stripe)
                        </div>
                    )}
                </div>
            </div>

            {error && <div className="mb-12 p-6 bg-red-50 text-red-600 rounded-[32px] border border-red-100 text-center font-bold shadow-xl shadow-red-500/5">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
                {plans.filter(p => p.isPublic || (couponPlan && p.id === couponPlan.id)).map((plan) => (
                    <button 
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={cn(
                            "bg-white border-2 rounded-[56px] p-10 text-left transition-all relative flex flex-col group",
                            selectedPlan?.id === plan.id 
                                ? "border-primary shadow-[0_48px_100px_-24px_rgba(37,99,235,0.15)] scale-105" 
                                : "border-zinc-100 hover:border-zinc-300 shadow-sm"
                        )}
                    >
                        {selectedPlan?.id === plan.id && (
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2.5 rounded-full shadow-2xl">Targeted Plan</div>
                        )}
                        <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase italic">{plan.name}</h3>
                        <p className="text-sm font-bold text-slate-500 mb-10 leading-relaxed font-inter">{plan.description}</p>
                        
                        <div className="text-4xl font-black text-slate-950 mb-10 flex items-baseline gap-1 tracking-tighter uppercase italic">
                            <span className="text-2xl text-slate-400 not-italic">₹</span> {plan.monthlyPrice}
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-2 not-italic font-inter">/ month</span>
                        </div>

                        <div className="space-y-5 flex-1 mb-10">
                            <div className="flex items-center gap-4 text-sm font-bold text-slate-700 font-inter">
                                <Users className="h-5 w-5 text-blue-500 bg-blue-50 rounded-lg p-1" /> {plan.maxAgents} Agents Max
                            </div>
                            {plan.features?.map((f: string, i: number) => (
                                <div key={i} className="flex items-start gap-4 text-xs font-bold text-slate-600 font-inter">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                    {f}
                                </div>
                            ))}
                        </div>

                        <div className={cn(
                            "w-full py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all",
                            selectedPlan?.id === plan.id ? "bg-slate-900 text-white shadow-xl" : "bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100"
                        )}>
                            {selectedPlan?.id === plan.id ? (plan.name === "Enterprise" ? "Contact Support" : (couponPlan ? "Activate Account" : "Authorize 3-Day Trial")) : "View Details"}
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-20 flex flex-col items-center">
                <button 
                    disabled={!selectedPlan || loading}
                    onClick={handleStartTrial}
                    className="px-16 py-8 bg-blue-600 text-white rounded-[40px] font-black text-xl shadow-2xl shadow-blue-600/30 hover:scale-[1.03] active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all flex items-center gap-4 group uppercase italic"
                >
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (selectedPlan?.name === "Enterprise" && !couponPlan ? "Request Enterprise Access" : "Authorise Activation")}
                    <ChevronRight className="h-7 w-7 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <p className="mt-10 text-center text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] max-w-lg leading-relaxed font-inter">
                   Secure Deployment: AES-256 Protected Connection
                </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
