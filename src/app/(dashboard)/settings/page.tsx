"use client"

import { useState, useEffect } from "react"
import { 
  Settings, User, Building2, 
  ShieldCheck, Bell, Smartphone, 
  Globe, CreditCard, ExternalLink,
  Loader2, CheckCircle2, Lock
} from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    customDomain: "",
    logo: ""
  })
  const [subscription, setSubscription] = useState({
    status: "INACTIVE",
    plan: ""
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch("/api/agency/settings")
      .then(res => res.json())
      .then(data => {
        setFormData({
            name: data.name || "",
            domain: data.domain || "",
            customDomain: data.customDomain || "",
            logo: data.logo || ""
        })
        setSubscription(data.subscription || { status: "INACTIVE", plan: "" })
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)
    try {
      const res = await fetch("/api/agency/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const err = await res.json()
        alert(err.error || "Failed to update")
      }
    } catch (e) {
      alert("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  const isEnterprise = subscription.plan === "ENTERPRISE"
  const isActive = subscription.status === "ACTIVE"

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-20 mt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-50 pb-8">
        <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic flex items-center gap-4">
                <div className="p-3 bg-slate-900 text-white rounded-[20px] shadow-2xl shadow-slate-900/20">
                    <Settings className="h-8 w-8" />
                </div>
                Architectural Governance
            </h1>
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] mt-2 italic ml-1">Configuring {formData.name || "Master"} Agency Node within the Global Real Estate Registry</p>
        </div>
        {success && (
            <div className="flex items-center gap-3 px-8 py-4 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black border border-emerald-100 uppercase tracking-[0.2em] italic shadow-lg shadow-emerald-500/10 animate-in slide-in-from-right-8 duration-500">
                <CheckCircle2 className="h-4 w-4" />
                Governance Protocol Updated Successfully
            </div>
        )}
      </div>

      <div className="space-y-12">
        <section className="bg-white rounded-[60px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-700">
          <div className="p-10 border-b border-slate-50 flex items-center gap-6 bg-slate-50/30">
             <div className="p-4 bg-indigo-600/10 text-indigo-600 rounded-[20px] shadow-sm"><Building2 className="h-8 w-8" /></div>
             <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">Global Brand Identity</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1 italic">Internal Agency Designation & Visual Realization</p>
             </div>
          </div>
          <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic ml-1">Agency Designation (Display Name)</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Real Estate Pro Matrix" 
                className="w-full px-8 py-5 rounded-[32px] border border-slate-50 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/5 transition-all" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic ml-1">CRM Internal Ingress (Subdomain)</label>
              <input 
                type="text" 
                value={formData.domain}
                onChange={(e) => setFormData({...formData, domain: e.target.value})}
                placeholder="crm-agency-node" 
                className="w-full px-8 py-5 rounded-[32px] border border-slate-50 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/5 transition-all" 
              />
            </div>
            <div className="space-y-3 col-span-1 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic ml-1">Symbolic Realization (Logo Image URL)</label>
              <input 
                type="text" 
                value={formData.logo}
                onChange={(e) => setFormData({...formData, logo: e.target.value})}
                placeholder="https://cloud.matrix.com/logo.png" 
                className="w-full px-8 py-5 rounded-[32px] border border-slate-50 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/5 transition-all" 
              />
            </div>
          </div>
        </section>

        <section className={`bg-white rounded-[60px] border border-slate-100 shadow-sm overflow-hidden transition-all duration-700 hover:shadow-2xl ${(!isEnterprise || !isActive) ? 'opacity-90 grayscale-[0.5]' : ''}`}>
          <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
             <div className="flex items-center gap-6">
                <div className="p-4 bg-purple-600/10 text-purple-600 rounded-[20px] shadow-sm"><Globe className="h-8 w-8" /></div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">Domain Isolation Registry</h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1 italic">Enterprise Architectural Identity Locking</p>
                </div>
             </div>
             {(!isEnterprise || !isActive) && (
                <span className="px-6 py-3 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-[0.2em] italic flex items-center gap-2 border border-amber-100 shadow-sm">
                    <Lock className="h-4 w-4" /> Enterprise Restricted
                </span>
             )}
          </div>
          <div className="p-12 space-y-8">
             <p className="text-sm text-slate-500 font-black italic leading-relaxed max-w-2xl border-l-4 border-indigo-500/20 pl-8 ml-2">
                Establish high-authority architectural isolation by connecting your master top-level domain. 
                All fiscal operations, client portals, and governance matrices will be isolated under this secure ingress.
             </p>
             
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic ml-1">Primary Isolation Ingress (Custom Domain)</label>
                <div className="relative group">
                    <input 
                        type="text" 
                        value={formData.customDomain}
                        disabled={!isEnterprise || !isActive}
                        onChange={(e) => setFormData({...formData, customDomain: e.target.value})}
                        placeholder="dash.youragency.matrix" 
                        className={`w-full px-8 py-5 rounded-[32px] border border-slate-50 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/5 transition-all ${(!isEnterprise || !isActive) ? 'cursor-not-allowed' : ''}`} 
                    />
                    {(!isEnterprise || !isActive) && (
                        <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none text-slate-200">
                            <Lock className="h-6 w-6" />
                        </div>
                    )}
                </div>
             </div>

             {(!isEnterprise || !isActive) ? (
                 <Link href="/dashboard/billing" className="inline-flex items-center gap-3 px-8 py-4 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic border border-amber-100 hover:bg-amber-600 hover:text-white transition-all group shadow-sm">
                     Upgrade to Enterprise Tier to Activate Domain Isolation
                     <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                 </Link>
             ) : (
                <div className="p-8 bg-blue-50/40 rounded-[40px] border border-blue-50 flex gap-6 items-center shadow-inner">
                    <div className="p-4 bg-white text-blue-600 rounded-[24px] shadow-sm animate-pulse">
                        <Settings className="h-7 w-7" />
                    </div>
                    <div>
                        <p className="text-[11px] font-black uppercase text-blue-900 tracking-[0.2em] italic mb-1">Pending Ingress Strategy: DNS Resolution</p>
                        <p className="text-[10px] text-blue-700/80 font-black italic uppercase tracking-[0.1em]">Map your CNAME registry to the master cluster endpoint. SSL Genesis will initialize upon discovery.</p>
                    </div>
                </div>
             )}
          </div>
        </section>

        <div className="flex justify-end gap-6 pt-4">
            <button 
                onClick={handleSave}
                disabled={saving}
                className="px-12 py-6 bg-slate-900 text-white rounded-[32px] text-[11px] font-black uppercase tracking-[0.4em] italic hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-slate-900/20 disabled:opacity-50"
            >
                {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <><CheckCircle2 className="h-6 w-6 text-emerald-400" /> Commit Architectural Changes ⚡</>}
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
           <div className="flex items-center gap-4 p-8 bg-slate-50/50 rounded-[40px] border border-slate-100/50">
                <div className="p-3 bg-white rounded-2xl shadow-sm"><ShieldCheck className="h-6 w-6 text-emerald-500" /></div>
                <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-800 italic">SSL Genesis Active</p>
                     <p className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 mt-1 italic">Automated Layer 7 Security</p>
                </div>
           </div>
           <div className="flex items-center gap-4 p-8 bg-slate-50/50 rounded-[40px] border border-slate-100/50">
                <div className="p-3 bg-white rounded-2xl shadow-sm"><Globe className="h-6 w-6 text-indigo-500" /></div>
                <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-800 italic">Enterprise Isolation</p>
                     <p className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 mt-1 italic">Independent Cluster Architecture</p>
                </div>
           </div>
        </div>
      </div>
    </div>
  )
}
