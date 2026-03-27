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
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">System Settings</h1>
            <p className="text-slate-500 text-sm mt-0.5">Configure your agency preferences and Enterprise white-labeling.</p>
        </div>
        {success && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold border border-emerald-100 animate-in fade-in slide-in-from-top-4">
                <CheckCircle2 className="h-4 w-4" />
                Changes saved successfully!
            </div>
        )}
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center gap-3">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Building2 className="h-5 w-5" /></div>
             <h2 className="font-black text-slate-800">Agency White-labeling</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Agency Display Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Real Estate Pro" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Internal CRM Subdomain</label>
              <input 
                type="text" 
                value={formData.domain}
                onChange={(e) => setFormData({...formData, domain: e.target.value})}
                placeholder="crm-agency (lowercase only)" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" 
              />
            </div>
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Logo Image URL</label>
              <input 
                type="text" 
                value={formData.logo}
                onChange={(e) => setFormData({...formData, logo: e.target.value})}
                placeholder="https://example.com/logo.png" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-primary outline-none" 
              />
            </div>
          </div>
        </section>

        <section className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all ${(!isEnterprise || !isActive) ? 'opacity-90' : ''}`}>
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Globe className="h-5 w-5" /></div>
                <h2 className="font-black text-slate-800">Enterprise Custom Domain</h2>
             </div>
             {(!isEnterprise || !isActive) && (
                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-tighter flex items-center gap-1 border border-amber-100">
                    <Lock className="h-3 w-3" /> Enterprise Feature
                </span>
             )}
          </div>
          <div className="p-8 space-y-6">
             <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Connect your own top-level domain (e.g., <code className="text-primary bg-primary/5 px-2 py-0.5 rounded">portal.myagency.com</code>) to the CRM.
                All billing, client portals, and staff dashboards will be accessible through this domain.
             </p>
             
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Primary Custom Domain</label>
                <div className="relative">
                    <input 
                        type="text" 
                        value={formData.customDomain}
                        disabled={!isEnterprise || !isActive}
                        onChange={(e) => setFormData({...formData, customDomain: e.target.value})}
                        placeholder="e.g. dash.youragency.com" 
                        className={`w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-primary outline-none ${(!isEnterprise || !isActive) ? 'bg-slate-50 cursor-not-allowed opacity-50' : ''}`} 
                    />
                    {(!isEnterprise || !isActive) && (
                        <div className="absolute inset-0 flex items-center justify-end pr-4 pointer-events-none">
                            <Lock className="h-4 w-4 text-slate-300" />
                        </div>
                    )}
                </div>
             </div>

             {(!isEnterprise || !isActive) ? (
                 <Link href="/dashboard/billing" className="inline-flex items-center gap-2 text-sm font-black text-primary hover:underline group">
                     Upgrade to Enterprise to activate custom domains
                     <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                 </Link>
             ) : (
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-xl h-fit">
                        <Settings className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-blue-900">Next Step: DNS Configuration</p>
                        <p className="text-xs text-blue-700 mt-1">Point your domain&apos;s CNAME record to our server hostname. SSL will be automatically provisioned.</p>
                    </div>
                </div>
             )}
          </div>
        </section>

        <div className="flex justify-end gap-4">
            <button 
                onClick={handleSave}
                disabled={saving}
                className="px-10 py-4 bg-primary text-white rounded-2xl text-base font-black hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50"
            >
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <><CheckCircle2 className="h-5 w-5" /> Save All Settings</>}
            </button>
        </div>

        <div className="flex justify-center py-10 opacity-30 gap-6">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><ShieldCheck className="h-4 w-4" /> SSL Provisioning Active</div>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Globe className="h-4 w-4" /> Enterprise Isolation</div>
        </div>
      </div>
    </div>
  )
}
