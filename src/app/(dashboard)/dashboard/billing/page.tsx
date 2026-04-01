"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
  Check, Shield, Zap, 
  Crown, CreditCard, Clock, 
  ArrowRight, Loader2, Sparkles,
  Users
} from "lucide-react"

export default function BillingPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<string | null>(null)
  const [subStatus, setSubStatus] = useState<any>(null)
  const [livePlans, setLivePlans] = useState<any[]>([])
  const [fetchingPlans, setFetchingPlans] = useState(true)

  useEffect(() => {
    // 1. Fetch current subscription status
    fetch("/api/billing/status")
      .then(res => res.json())
      .then(data => setSubStatus(data))
      .catch(() => {})

    // 2. Fetch live plans from DB
    fetch("/api/plans")
      .then(res => res.json())
      .then(data => {
          setLivePlans(data)
          setFetchingPlans(false)
      })
      .catch(() => setFetchingPlans(false))
  }, [])

  const handleSubscribe = async (priceId: string) => {
    if (!priceId) {
        alert("This plan is not available for online purchase yet. Contact support.")
        return
    }
    setLoading(priceId)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || "Failed to initiate checkout")
      }
    } catch (err) {
      alert("Error connecting to Stripe")
    } finally {
      setLoading(null)
    }
  }

  const getPlanIcon = (name: string, index: number) => {
      if (name.toLowerCase().includes("starter")) return Zap
      if (index === 1) return Crown
      return Shield
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">
           <Zap className="h-3 w-3" /> Live Commercial Tiers
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Expand Your Agency Force</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Unlock more agent seats, high-volume WhatsApp automation, and advanced lead intelligence.</p>

        {subStatus && (
          <div className="mt-8 p-6 bg-white border border-slate-200 rounded-[30px] shadow-sm max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Crown className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Membership</p>
                <p className="text-lg font-black text-slate-800">{subStatus.plan}</p>
              </div>
            </div>
            <div className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest ${subStatus.status === "ACTIVE" ? "bg-emerald-500 text-white animate-pulse" : "bg-zinc-100 text-zinc-500"}`}>
              {subStatus.status}
            </div>
          </div>
        )}
      </div>

      {fetchingPlans ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Synchronizing Plans...</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {livePlans.map((plan, idx) => {
                const Icon = getPlanIcon(plan.name, idx)
                const isPopular = idx === 1 // Usually the middle one
                
                return (
                    <div 
                        key={plan.id}
                        className={`relative flex flex-col p-8 rounded-[40px] border transition-all duration-300 ${isPopular ? "bg-white border-primary shadow-2xl scale-105 z-10" : "bg-white border-slate-100 shadow-sm hover:border-zinc-200"}`}
                    >
                        {isPopular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                            Most Popular
                        </div>
                        )}
                        
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${isPopular ? "bg-primary text-white" : "bg-zinc-50 text-zinc-400"}`}>
                            <Icon className="h-7 w-7" />
                        </div>

                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{plan.name}</h3>
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-4xl font-black text-slate-900 leading-none">₹{plan.monthlyPrice}</span>
                            <span className="text-zinc-400 font-bold text-sm">/month</span>
                        </div>
                        
                        <div className="mt-6 flex flex-col gap-2">
                             <div className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest">
                                 <Users className="h-3.5 w-3.5" /> {plan.maxAgents} Agent Seats
                             </div>
                        </div>

                        <ul className="mt-8 space-y-4 flex-1">
                            {plan.features?.map((feature: string) => (
                                <li key={feature} className="flex items-center gap-3 text-sm text-slate-600 font-bold">
                                    <div className={`p-0.5 rounded-full ${isPopular ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-400"}`}>
                                        <Check className="h-3 w-3" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleSubscribe(plan.stripePriceId)}
                            disabled={loading === plan.stripePriceId || (subStatus?.plan === plan.name)}
                            className={`mt-10 w-full py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs ${
                                subStatus?.plan === plan.name 
                                ? "bg-zinc-100 text-zinc-400 cursor-default" 
                                : isPopular 
                                    ? "bg-primary text-white shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-95" 
                                    : "bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02] active:scale-95"
                            }`}
                        >
                            {loading === plan.stripePriceId ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : subStatus?.plan === plan.name ? (
                                "Current Plan"
                            ) : (
                                <>Choose {plan.name} <ArrowRight className="h-4 w-4" /></>
                            )}
                        </button>
                    </div>
                )
            })}
        </div>
      )}

      <div className="bg-slate-900 rounded-[40px] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] group-hover:bg-primary/40 transition-all duration-500" />
        <div className="space-y-3 relative z-10 text-center md:text-left">
          <h2 className="text-3xl font-black tracking-tight">Need a customized enterprise solution?</h2>
          <p className="text-slate-400 text-base font-medium">We offer tailored pricing and multi-branch support for large-scale operations.</p>
        </div>
        <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 uppercase tracking-widest text-xs relative z-10">Contact Corporate Sales</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center gap-5 hover:border-zinc-200 transition-colors">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><CreditCard className="h-7 w-7" /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Gateway</p>
              <p className="text-sm font-bold text-slate-700">PCI DSS Compliant</p>
            </div>
         </div>
         <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center gap-5 hover:border-zinc-200 transition-colors">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-xl"><Clock className="h-7 w-7" /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flexibility</p>
              <p className="text-sm font-bold text-slate-700">Cancel or switch anytime</p>
            </div>
         </div>
         <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center gap-5 hover:border-zinc-200 transition-colors">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><Shield className="h-7 w-7" /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Factor</p>
              <p className="text-sm font-bold text-slate-700">Verified CRM Services</p>
            </div>
         </div>
      </div>
    </div>
  )
}
