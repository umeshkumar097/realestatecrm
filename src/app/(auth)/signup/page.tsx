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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (step === 2) {
      fetch("/api/plans").then(res => res.json()).then(setPlans)
    }
  }, [step])

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleStartTrial = async () => {
    if (!selectedPlan) {
        setError("Please select a plan to continue.")
        return
    }
    if (!formData.email) {
        setError("Please complete your agency details in the previous step.")
        setStep(1)
        return
    }
    
    setLoading(true)
    setError("")

    try {
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
      if (!res.ok) throw new Error(data.error || "Failed to start trial")

      window.location.href = data.url
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-center gap-2 mb-10">
            <div className={cn("w-3 h-3 rounded-full transition-all duration-500", step >= 1 ? "bg-primary" : "bg-zinc-200")} />
            <div className={cn("w-12 h-1 bg-zinc-200 rounded-full", step >= 2 ? "bg-primary" : "bg-zinc-200")} />
            <div className={cn("w-3 h-3 rounded-full transition-all duration-500", step >= 2 ? "bg-primary" : "bg-zinc-200")} />
        </div>

        {step === 1 ? (
          <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-zinc-200 dark:border-zinc-800 p-10">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-primary/20">
                <Building2 className="text-white h-8 w-8" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter">Launch Your Agency</h1>
              <p className="text-zinc-500 text-sm mt-1 text-center font-medium">Set up your workspace in seconds.</p>
            </div>

            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Agency Name</label>
                <input required
                  className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                  placeholder="Elite Realty"
                  value={formData.agencyName}
                  onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Full Name</label>
                <input required
                  className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Work Email</label>
                <input type="email" required
                  className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                  placeholder="john@agency.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Secure Password</label>
                <input type="password" required
                  className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-6 uppercase tracking-widest text-sm">
                Next: Select Package <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-black tracking-tighter mb-2">Choose Your Power Plan</h2>
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" /> All plans include a 38-hour priority setup
                </p>
            </div>

            {error && <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center font-bold">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {loading && plans.length === 0 ? (
                    <div className="col-span-3 text-center py-20 bg-white rounded-[40px] border border-zinc-200">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-zinc-500 font-bold">Gathering available packages...</p>
                    </div>
                ) : plans.length === 0 ? (
                    <div className="col-span-3 text-center py-20 bg-white rounded-[40px] border border-zinc-200">
                        <XCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                        <p className="text-zinc-500 font-bold">No packages available at the moment. Please contact support.</p>
                        <button onClick={() => setStep(2)} className="mt-4 text-primary font-black uppercase text-xs tracking-widest">Retry Fetching</button>
                    </div>
                ) : plans.map((plan) => (
                    <button 
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={cn(
                            "bg-white border-2 rounded-[40px] p-8 text-left transition-all relative flex flex-col group",
                            selectedPlan?.id === plan.id 
                                ? "border-primary shadow-2xl scale-105" 
                                : "border-zinc-100 hover:border-zinc-300 shadow-sm"
                        )}
                    >
                        {selectedPlan?.id === plan.id && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">Selected</div>
                        )}
                        <h3 className="text-2xl font-black mb-1">{plan.name}</h3>
                        <p className="text-sm font-bold text-zinc-500 mb-6">{plan.description}</p>
                        
                        <div className="text-3xl font-black mb-8 flex items-baseline gap-1">
                            <IndianRupee className="h-5 w-5" /> {plan.monthlyPrice}
                            <span className="text-xs font-bold text-zinc-400 not-italic">/mo</span>
                        </div>

                        <div className="space-y-4 flex-1 mb-8">
                            <div className="flex items-center gap-3 text-sm font-bold text-zinc-600">
                                <Users className="h-4 w-4 text-zinc-400" /> {plan.maxAgents} Agents Max
                            </div>
                            {plan.features?.map((f: string, i: number) => (
                                <div key={i} className="flex items-start gap-3 text-sm font-bold text-zinc-600">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                    {f}
                                </div>
                            ))}
                        </div>

                        <div className={cn(
                            "w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center transition-all",
                            selectedPlan?.id === plan.id ? "bg-primary text-white" : "bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100"
                        )}>
                            {selectedPlan?.id === plan.id ? "Start 3-Day Trial" : "Select Plan"}
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-12 flex flex-col items-center">
                <button 
                    disabled={!selectedPlan || loading}
                    onClick={handleStartTrial}
                    className="px-12 py-5 bg-zinc-950 text-white rounded-[24px] font-black text-lg shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-3"
                >
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Authorize 3-Day Trial Checkout"}
                    <ChevronRight className="h-6 w-6" />
                </button>
                <button onClick={() => setStep(1)} className="mt-6 text-sm font-bold text-zinc-400 hover:text-zinc-600 uppercase tracking-widest">← Back to Details</button>
                <p className="mt-8 text-center text-xs text-zinc-400 max-w-md font-medium leading-relaxed">
                    By starting the trial, you authorize billing on your selected plan after 3 days. 
                    <span className="text-zinc-800 font-bold px-1">You can cancel at any time via your dashboard</span> 
                    before the trial ends to avoid any charges.
                </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
