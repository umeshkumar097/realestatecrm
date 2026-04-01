"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
  Check, Shield, Zap, 
  Crown, CreditCard, Clock, 
  ArrowRight, Loader2, Sparkles,
  Users, Plus
} from "lucide-react"

export default function BillingPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "PLANS" | "INVOICES" | "SETTINGS" | "CLIENT_BILLING">("OVERVIEW")
  const [loading, setLoading] = useState<string | null>(null)
  const [subStatus, setSubStatus] = useState<any>(null)
  const [livePlans, setLivePlans] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [promoCode, setPromoCode] = useState("")

  const getPlanIcon = (name: string, index: number) => {
    if (name.toLowerCase().includes("starter")) return Zap
    if (index === 1) return Crown
    return Shield
  }

  const [billingForm, setBillingForm] = useState({
      gstNumber: "",
      billingAddress: "",
      billingEmail: ""
  })

  const handleSubAction = async (action: string, pId?: string) => {
    setLoading(action)
    try {
        const res = await fetch("/api/billing/manage-subscription", {
            method: "POST",
            body: JSON.stringify({ action, priceId: pId })
        })
        const data = await res.json()
        if (res.ok) {
            alert(data.message)
            fetchData()
        } else alert(data.error)
    } catch (e) { alert("Failed to manage subscription") }
    finally { setLoading(null) }
  }

  const fetchData = async () => {
    setFetching(true)
    try {
        const [statusRes, plansRes, invoicesRes] = await Promise.all([
            fetch("/api/billing/status"),
            fetch("/api/plans"),
            fetch("/api/billing/invoices")
        ])
        
        const statusData = await statusRes.json()
        const plansData = await plansRes.json()
        const invoicesData = await invoicesRes.json()

        setSubStatus(statusData)
        setLivePlans(plansData)
        setInvoices(invoicesData.invoices || [])
        setBillingForm({
            gstNumber: statusData.gstNumber || "",
            billingAddress: statusData.billingAddress || "",
            billingEmail: statusData.billingEmail || ""
        })
    } catch (err) {
        console.error("Billing data fetch failed")
    } finally {
        setFetching(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenPortal = async () => {
    setLoading("portal")
    try {
        const res = await fetch("/api/billing/portal", { method: "POST" })
        const data = await res.json()
        if (data.url) window.location.href = data.url
        else alert(data.error || "Failed to open billing portal")
    } catch (e) {
        alert("Error connecting to billing service")
    } finally {
        setLoading(null)
    }
  }

  const handleUpdateSettings = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading("settings")
      try {
          const res = await fetch("/api/agency/billing-settings", {
              method: "PATCH",
              body: JSON.stringify(billingForm)
          })
          if (res.ok) alert("Billing settings updated successfully!")
          else alert("Update failed")
      } catch (e) {
          alert("Network error")
      } finally {
          setLoading(null)
      }
  }

  const handleApplyCoupon = async () => {
      if (!promoCode) return
      setLoading("coupon")
      try {
          const res = await fetch("/api/coupons/validate", {
              method: "POST",
              body: JSON.stringify({ code: promoCode })
          })
          const data = await res.json()
          if (res.ok) {
              alert(`Success! Code ${promoCode} applied: ${data.message || "Discount activated."}`)
              fetchData() // Refresh to see changes
          } else {
              alert(data.error || "Invalid or expired promo code")
          }
      } catch (e) {
          alert("Failed to validate code")
      } finally {
          setLoading(null)
      }
  }

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
      if (data.url) window.location.href = data.url
      else alert(data.error || "Failed to initiate checkout")
    } catch (err) {
      alert("Error connecting to Stripe")
    } finally {
      setLoading(null)
    }
  }

  if (fetching) return (
    <div className="flex flex-col items-center justify-center h-full p-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Synchronizing Vault...</p>
    </div>
  )

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Command Center</h1>
              <p className="text-slate-500 font-medium">Manage your agency subscription, commercial invoices, and white-label billing.</p>
          </div>
          
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-2xl w-fit border border-zinc-200">
              {[
                  { id: "OVERVIEW", label: "Overview" },
                  { id: "PLANS", label: "Plans" },
                  { id: "INVOICES", label: "Invoices" },
                  { id: "SETTINGS", label: "Settings" },
                  { id: "CLIENT_BILLING", label: "Client Invoicing" }
              ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === tab.id 
                        ? "bg-white text-primary shadow-sm" 
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                      {tab.label}
                  </button>
              ))}
          </div>
      </div>

      {activeTab === "OVERVIEW" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Active Membership */}
                  <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm flex flex-col justify-between">
                      <div>
                          <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Plan</span>
                              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Crown size={16}/></div>
                          </div>
                          <div className="flex items-center justify-between">
                             <h2 className="text-2xl font-black text-slate-800">{subStatus?.plan || "Free Trial"}</h2>
                             {subStatus?.status === "CANCELED" && <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Ends Soon</span>}
                          </div>
                          <p className={`mt-1 text-[10px] font-black uppercase tracking-widest ${subStatus?.status === "ACTIVE" ? "text-emerald-500" : "text-zinc-400"}`}>
                              Status: {subStatus?.status || "PENDING"}
                          </p>
                      </div>
                      
                      <div className="mt-8 grid grid-cols-1 gap-2">
                        {subStatus?.status === "ACTIVE" ? (
                            <button 
                                onClick={() => handleSubAction("CANCEL")}
                                disabled={loading === "CANCEL"}
                                className="flex items-center justify-center gap-2 w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                {loading === "CANCEL" ? <Loader2 size={16} className="animate-spin"/> : "Cancel Subscription"}
                            </button>
                        ) : subStatus?.status === "CANCELED" ? (
                            <button 
                                onClick={() => handleSubAction("RESUME")}
                                disabled={loading === "RESUME"}
                                className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                {loading === "RESUME" ? <Loader2 size={16} className="animate-spin"/> : "Resume Renewal"}
                            </button>
                        ) : (
                            <button 
                                onClick={handleOpenPortal}
                                disabled={loading === "portal"}
                                className="flex items-center justify-center gap-2 w-full py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                {loading === "portal" ? <Loader2 size={16} className="animate-spin"/> : <><CreditCard size={14}/> Manage Billing</>}
                            </button>
                        )}
                      </div>
                  </div>

                  {/* Usage Summary */}
                  <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Usage</span>
                          <div className="p-2 bg-primary/10 text-primary rounded-lg"><Zap size={16}/></div>
                      </div>
                      <div className="space-y-6">
                          <div>
                              <div className="flex justify-between text-xs font-black text-slate-700 mb-1.5">
                                  <span className="uppercase tracking-widest">Staff Seats</span>
                                  <span>{subStatus?.usage?.users} / {subStatus?.usage?.maxUsers}</span>
                              </div>
                              <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary transition-all duration-500" 
                                    style={{ width: `${(subStatus?.usage?.users / (subStatus?.usage?.maxUsers || 1)) * 100}%` }}
                                  />
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Expiry / Renewal */}
                  <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-xl text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] -z-10 group-hover:bg-primary/20 transition-all duration-700" />
                      <div className="flex items-center justify-between mb-6">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Next Renewal</span>
                          <div className="p-2 bg-white/10 text-white rounded-lg"><Clock size={16}/></div>
                      </div>
                      <h2 className="text-2xl font-black">{subStatus?.currentPeriodEnd ? new Date(subStatus.currentPeriodEnd).toLocaleDateString() : "LIFETIME"}</h2>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-400">Recurring Amount: ₹{livePlans.find(p => p.name === subStatus?.plan)?.monthlyPrice || 0}/mo</p>
                      
                      <div className="mt-8 pt-8 border-t border-white/10">
                          <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-3">Quick Actions</p>
                          <div className="grid grid-cols-2 gap-2">
                              <button onClick={() => setActiveTab("SETTINGS")} className="py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all">Update GST</button>
                              <button onClick={() => setActiveTab("INVOICES")} className="py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all">View History</button>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Coupons & Alerts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white border-2 border-dashed border-zinc-200 rounded-[32px] p-8 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <div className="p-4 bg-zinc-900 text-white rounded-2xl"><Sparkles size={24}/></div>
                          <div>
                              <h3 className="font-black text-slate-800 tracking-tight">Have a promo code?</h3>
                              <p className="text-xs text-zinc-500 font-medium">Apply a gift code to unlock premiums.</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-2">
                          <input 
                            placeholder="GIFT2026"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs font-black uppercase outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <button 
                            onClick={handleApplyCoupon}
                            disabled={loading === "coupon"}
                            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                          >
                              {loading === "coupon" ? <Loader2 size={12} className="animate-spin"/> : "Apply"}
                          </button>
                      </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 rounded-[32px] p-8 flex items-center gap-4">
                      <div className="p-4 bg-amber-500 text-white rounded-2xl animate-bounce"><Shield size={24}/></div>
                      <div>
                          <h3 className="font-black text-amber-900 tracking-tight">Billing Advisory</h3>
                          <p className="text-xs text-amber-700 font-medium">Auto-renew is active. Invoices will be dispatched 3 days before renewal.</p>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {activeTab === "PLANS" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {livePlans.map((plan, idx) => {
                    const Icon = getPlanIcon(plan.name, idx)
                    const isPopular = idx === 1 
                    const isCurrent = subStatus?.plan === plan.name
                    
                    return (
                        <div 
                            key={plan.id}
                            className={`relative flex flex-col p-8 rounded-[40px] border transition-all duration-300 ${isPopular ? "bg-white border-primary shadow-2xl scale-105 z-10" : "bg-white border-slate-100 shadow-sm"}`}
                        >
                            {isPopular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${isPopular ? "bg-primary text-white" : "bg-zinc-50 text-zinc-400"}`}><Icon size={28}/></div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{plan.name}</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900 leading-none">₹{plan.monthlyPrice}</span>
                                <span className="text-zinc-400 font-bold text-sm">/month</span>
                            </div>
                            <div className="mt-6 flex flex-col gap-2"><div className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest"><Users size={14}/> {plan.maxAgents} Agent Seats</div></div>
                            <ul className="mt-8 space-y-4 flex-1">
                                {plan.features?.map((f: string) => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-slate-600 font-bold"><Check size={14} className={isPopular ? "text-emerald-500" : "text-zinc-300"}/> {f}</li>
                                ))}
                            </ul>
                            <button
                                onClick={() => isCurrent ? null : subStatus?.stripeSubscriptionId ? handleSubAction("SWITCH", plan.stripePriceId) : handleSubscribe(plan.stripePriceId)}
                                disabled={loading === plan.stripePriceId || isCurrent || loading === "SWITCH"}
                                className={`mt-10 w-full py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs ${
                                    isCurrent ? "bg-zinc-100 text-zinc-400 cursor-default" : isPopular ? "bg-primary text-white shadow-xl shadow-primary/25 hover:scale-[1.02]" : "bg-slate-900 text-white hover:bg-slate-800"
                                }`}
                            >
                                {loading === plan.stripePriceId || loading === "SWITCH" ? <Loader2 size={20} className="animate-spin"/> : isCurrent ? "Current Plan" : subStatus?.stripeSubscriptionId ? "Direct Upgrade" : "Choose Plan"}
                            </button>
                        </div>
                    )
                })}
             </div>
          </div>
      )}

      {activeTab === "INVOICES" && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500 bg-white border border-slate-200 rounded-[40px] overflow-hidden">
              <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
                  <div>
                      <h2 className="text-xl font-black tracking-tight">Commercial Manifests</h2>
                      <p className="text-xs text-zinc-400 font-black uppercase tracking-widest mt-1">Convergence of Stripe receipts & Platform invoices</p>
                  </div>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead>
                          <tr className="bg-zinc-50 border-b border-zinc-100">
                              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Invoice ID</th>
                              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Amount Paid</th>
                              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Date</th>
                              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Mode</th>
                              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Action</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50">
                          {invoices.map((inv) => (
                              <tr key={inv.id} className="hover:bg-zinc-50/50 transition-colors">
                                  <td className="px-8 py-6 text-sm font-black text-slate-800 uppercase tracking-tighter">{inv.number}</td>
                                  <td className="px-8 py-6 text-sm font-black text-slate-900">₹{(inv.amount / 100).toLocaleString()}</td>
                                  <td className="px-8 py-6 text-xs font-bold text-zinc-500">{new Date(inv.date).toLocaleDateString()}</td>
                                  <td className="px-8 py-6">
                                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                          inv.source === "STRIPE" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
                                      }`}>
                                          {inv.source}
                                      </span>
                                  </td>
                                  <td className="px-8 py-6 text-right">
                                      <a 
                                        href={inv.pdf} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                                      >
                                          View Manifest <ArrowRight size={14}/>
                                      </a>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {activeTab === "SETTINGS" && (
          <div className="animate-in zoom-in-95 duration-500 bg-white border border-slate-200 rounded-[40px] p-12 max-w-2xl mx-auto shadow-sm">
              <div className="mb-10 text-center">
                  <div className="w-16 h-16 bg-zinc-900 text-white rounded-[24px] flex items-center justify-center mx-auto mb-4 shadow-xl"><Shield size={32}/></div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Commercial Identity</h2>
                  <p className="text-sm text-zinc-500 font-medium">Verify your GST identification for compliant B2B invoicing.</p>
              </div>

              
              <form onSubmit={handleUpdateSettings} className="space-y-6">
                  <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">GSTIN (Verified)</label>
                       <input 
                         required
                         placeholder="GST Number"
                         className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                         value={billingForm.gstNumber}
                         onChange={(e) => setBillingForm({...billingForm, gstNumber: e.target.value})}
                       />
                  </div>
                  <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Company Registered Address</label>
                       <textarea 
                         required
                         placeholder="Address as per GST records"
                         rows={4}
                         className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                         value={billingForm.billingAddress}
                         onChange={(e) => setBillingForm({...billingForm, billingAddress: e.target.value})}
                       />
                  </div>
                  <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Billing Email</label>
                       <input 
                         required
                         type="email"
                         placeholder="accounts@youragency.com"
                         className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                         value={billingForm.billingEmail}
                         onChange={(e) => setBillingForm({...billingForm, billingEmail: e.target.value})}
                       />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading === "settings"}
                    className="w-full py-5 bg-primary text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                      {loading === "settings" ? <Loader2 size={18} className="animate-spin mx-auto"/> : "Save Commercial Identity"}
                  </button>
              </form>
          </div>
      )}


      {activeTab === "CLIENT_BILLING" && (
          <div className="animate-in fade-in duration-700 space-y-8">
              <div className="bg-primary/5 border border-primary/20 rounded-[40px] p-12 flex flex-col items-center text-center max-w-3xl mx-auto overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[120px] -z-10" />
                  <div className="p-6 bg-primary text-white rounded-[32px] mb-8 shadow-2xl shadow-primary/40"><Crown size={48}/></div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">White-Label Client Invoicing</h2>
                  <p className="text-slate-600 font-medium max-w-lg mb-10 leading-relaxed text-lg">
                      Generate professional invoices for your real estate clients, track commissions, and maintain your agency's brand identity. 
                      <span className="block mt-4 text-primary font-black uppercase tracking-widest text-[10px]">Coming Next Week: Direct Payment Collection</span>
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                      <div className="p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Billed</p>
                          <p className="text-xl font-black text-slate-800">₹0.00</p>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Commissions</p>
                          <p className="text-xl font-black text-slate-800">₹0.00</p>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm text-emerald-600">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Recovered</p>
                          <p className="text-xl font-black text-emerald-600">100%</p>
                      </div>
                      <div className="p-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center cursor-not-allowed">
                          <Plus size={20}/>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  )
}
