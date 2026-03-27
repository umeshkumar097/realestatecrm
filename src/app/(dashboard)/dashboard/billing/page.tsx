"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
  Check, Shield, Zap, 
  Crown, CreditCard, Clock, 
  ArrowRight, Loader2, Sparkles
} from "lucide-react"

const plans = [
  {
    id: "price_starter", // Placeholder
    name: "Starter",
    price: "49",
    description: "Perfect for individual agents starting their journey.",
    features: ["500 WhatsApp Messages/mo", "50 Clients Management", "Basic Dashboard", "Email Support"],
    color: "slate",
    icon: Zap
  },
  {
    id: "price_pro", // Placeholder
    name: "Agency Pro",
    price: "149",
    description: "Built for growing agencies with multiple agents.",
    features: ["Unlimited Messages", "Unlimited Clients", "Team Management", "AI Intent Extraction", "Priority Support"],
    color: "primary",
    icon: Crown,
    popular: true
  },
  {
    id: "price_enterprise", // Placeholder
    name: "Enterprise",
    price: "499",
    description: "Custom solutions for large-scale real estate firms.",
    features: ["Custom Integrations", "Dedicated Account Manager", "White-labeling", "API Access", "99.9% SL"],
    color: "indigo",
    icon: Shield
  }
]

export default function BillingPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<string | null>(null)
  const [subStatus, setSubStatus] = useState<any>(null)

  useEffect(() => {
    fetch("/api/billing/status")
      .then(res => res.json())
      .then(data => setSubStatus(data))
      .catch(() => {})
  }, [])

  const handleSubscribe = async (priceId: string) => {
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

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
           <Sparkles className="h-3 w-3" /> Monetization & Scaling
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Choose Your CRM Power Plan</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Upgrade your agency with advanced AI, team management, and unlimited WhatsApp automation.</p>

        {subStatus && (
          <div className="mt-8 p-6 bg-white border border-slate-200 rounded-[30px] shadow-sm max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Shield className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Plan</p>
                <p className="text-lg font-black text-slate-800">{subStatus.plan}</p>
              </div>
            </div>
            <div className="px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest animate-pulse">
              {subStatus.status}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`relative flex flex-col p-8 rounded-3xl border transition-all ${plan.popular ? "bg-white border-primary shadow-2xl scale-105 z-10" : "bg-white border-slate-100 shadow-sm"}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
            )}
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${plan.popular ? "bg-primary text-white" : "bg-slate-50 text-slate-400"}`}>
              <plan.icon className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-black text-slate-800">{plan.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900">${plan.price}</span>
              <span className="text-slate-400 font-bold">/month</span>
            </div>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">{plan.description}</p>

            <ul className="mt-8 space-y-4 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-slate-600 font-bold">
                  <div className={`p-0.5 rounded-full ${plan.popular ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                    <Check className="h-3 w-3" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading !== null}
              className={`mt-8 w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${plan.popular ? "bg-primary text-white shadow-xl shadow-primary/25 hover:opacity-90" : "bg-slate-900 text-white hover:bg-slate-800"}`}
            >
              {loading === plan.id ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>Get Started <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Need a custom enterprise solution?</h2>
          <p className="text-slate-400 text-sm">We offer high-volume pricing for agencies with 100+ agents.</p>
        </div>
        <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-slate-100 transition-all">Contact Sales</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><CreditCard className="h-6 w-6" /></div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Secure Payments</p>
              <p className="text-sm font-bold text-slate-700">PCI Compliant Processing</p>
            </div>
         </div>
         <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock className="h-6 w-6" /></div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Cancel Anytime</p>
              <p className="text-sm font-bold text-slate-700">No long-term contracts</p>
            </div>
         </div>
         <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Shield className="h-6 w-6" /></div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Money Back</p>
              <p className="text-sm font-bold text-slate-700">7-day satisfaction guarantee</p>
            </div>
         </div>
      </div>
    </div>
  )
}
