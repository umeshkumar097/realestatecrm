"use client"
import { useState, useEffect } from "react"
import { 
  Building2, Users, CreditCard, 
  Search, ShieldCheck, Globe, 
  ExternalLink, MoreVertical,
  Calendar, ArrowUpRight, Activity,
  IndianRupee, Mail, Phone, X,
  Plus, Settings, Package, CheckCircle2,
  Trash2
} from "lucide-react"
import PlanModal from "@/components/super-admin/PlanModal"

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<"AGENCIES" | "PLATFORM_LEADS" | "PLANS" | "COUPONS">("AGENCIES")
  const [agencies, setAgencies] = useState<any[]>([])
  const [platformLeads, setPlatformLeads] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [globalStats, setGlobalStats] = useState<any>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [agenciesRes, statsRes, platformLeadsRes, plansRes, couponsRes] = await Promise.all([
        fetch("/api/super-admin/agencies"),
        fetch("/api/super-admin/stats"),
        fetch("/api/super-admin/platform-leads"),
        fetch("/api/super-admin/plans"),
        fetch("/api/super-admin/coupons")
      ])
      
      if (agenciesRes.ok) {
        const data = await agenciesRes.json()
        setAgencies(data.agencies)
      }
      
      if (statsRes.ok) {
        const data = await statsRes.json()
        setGlobalStats(data.stats)
      }

      if (platformLeadsRes.ok) {
        const data = await platformLeadsRes.json()
        setPlatformLeads(data)
      }

      if (plansRes.ok) {
        const data = await plansRes.json()
        setPlans(data)
      }

      if (couponsRes.ok) {
          const data = await couponsRes.json()
          setCoupons(data)
      }
    } catch (err) {
      console.error("Failed to fetch superadmin data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredAgencies = agencies.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.domain || "").toLowerCase().includes(search.toLowerCase())
  )

  const filteredPlatformLeads = platformLeads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    (l.company || "").toLowerCase().includes(search.toLowerCase())
  )

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure?")) return
    const res = await fetch("/api/super-admin/platform-leads", {
        method: "DELETE",
        body: JSON.stringify({ id })
    })
    if (res.ok) fetchData()
  }

  const updateLeadStatus = async (id: string, status: string) => {
    const res = await fetch("/api/super-admin/platform-leads", {
        method: "PATCH",
        body: JSON.stringify({ id, status })
    })
    if (res.ok) fetchData()
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tighter italic text-slate-900">PropGo Global Mission Control</h1>
          <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-[0.2em] italic">Cluster Operational · Network Oversight Enabled.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/5 border border-emerald-500/10 rounded-full shadow-sm">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)] animate-pulse" />
             <span className="text-emerald-600 font-black text-[9px] uppercase tracking-[0.4em] italic">Cluster Sync: 100.0%</span>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab === 'AGENCIES' ? 'network' : 'leads'}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-full text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-blue-600/5 outline-none transition-all w-72 shadow-2xl shadow-black/5"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-full w-fit shadow-3xl shadow-black/20">
          <button 
            onClick={() => setActiveTab("AGENCIES")}
            className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] italic transition-all ${activeTab === "AGENCIES" ? "bg-white text-slate-900 shadow-xl" : "text-slate-400 hover:text-white"}`}
          >
            Agency Nodes
          </button>
          <button 
            onClick={() => setActiveTab("PLATFORM_LEADS")}
            className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] italic transition-all ${activeTab === "PLATFORM_LEADS" ? "bg-white text-slate-900 shadow-xl" : "text-slate-400 hover:text-white"}`}
          >
            Ingress Activity {platformLeads.length > 0 && <span className="ml-1 bg-blue-600 text-white px-2 py-0.5 rounded-full text-[8px] animate-bounce">{platformLeads.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab("PLANS")}
            className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] italic transition-all ${activeTab === "PLANS" ? "bg-white text-slate-900 shadow-xl" : "text-slate-400 hover:text-white"}`}
          >
            Architect Packages
          </button>
          <button 
            onClick={() => setActiveTab("COUPONS")}
            className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.3em] italic transition-all ${activeTab === "COUPONS" ? "bg-white text-slate-900 shadow-xl" : "text-slate-400 hover:text-white"}`}
          >
            Promo Keys
          </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        {activeTab === "AGENCIES" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Agency Resource Node</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Global Ingress</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Cluster Weight</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Governance</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Established</th>
                  <th className="px-10 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredAgencies.map((agency) => (
                  <tr key={agency.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-50 flex items-center justify-center font-black text-slate-400 uppercase shadow-sm group-hover:scale-110 transition-transform">
                          {agency.logo ? <img src={agency.logo} className="w-full h-full object-cover rounded-2xl" /> : agency.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 tracking-tight">{agency.name}</p>
                          <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] italic">Node ID: {agency.id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest italic group-hover:text-blue-600 transition-colors">
                          <Globe className="h-3.5 w-3.5 text-slate-300" />
                          {agency.subdomain || "master"}.propgocrm.com
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2" title="Users">
                          <Users className="h-4 w-4 text-slate-300" />
                          <span className="text-xs font-black text-slate-700">{agency._count?.users || 0}</span>
                        </div>
                        <div className="flex items-center gap-2" title="Leads">
                          <Activity className="h-4 w-4 text-emerald-400" />
                          <span className="text-xs font-black text-slate-700">{agency._count?.leads || 0}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                        <div className="flex flex-col gap-1">
                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-fit shadow-sm ${
                                agency.subscription?.status === "ACTIVE" 
                                    ? "bg-emerald-500 text-white" 
                                    : "bg-slate-100 text-slate-400"
                            }`}>
                                {agency.plan?.name || "Trial Access"}
                            </span>
                        </div>
                    </td>
                    <td className="px-6 py-6 font-black text-[10px] text-slate-400 uppercase tracking-widest italic">
                        {new Date(agency.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-3 bg-white shadow-xl rounded-[14px] text-slate-400 hover:text-blue-600 border border-slate-100 transition-all active:scale-90">
                              <ExternalLink className="h-4 w-4" />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === "PLATFORM_LEADS" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Global Inquirer</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Contact Node</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Enterprise Group</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Lifecycle Status</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Ingress Date</th>
                  <th className="px-10 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPlatformLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-all group">
                    <td className="px-10 py-6">
                        <p className="text-sm font-black text-slate-900 tracking-tight">{lead.name}</p>
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] italic">{lead.plan || "Enterprise Inquiry"}</p>
                    </td>
                    <td className="px-6 py-6">
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-slate-600 flex items-center gap-2 tracking-tight"><Mail className="h-3 w-3 text-slate-300" /> {lead.email}</p>
                            <p className="text-xs font-bold text-slate-600 flex items-center gap-2 tracking-tight"><Phone className="h-3 w-3 text-slate-300" /> {lead.phone}</p>
                        </div>
                    </td>
                    <td className="px-6 py-6 font-black text-sm text-slate-900 tracking-tight">
                        {lead.company || "Independent Elite"}
                        {lead.message && <p className="text-[10px] text-slate-400 font-medium line-clamp-1 italic max-w-xs">{lead.message}</p>}
                    </td>
                    <td className="px-6 py-6">
                        <select 
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            className="bg-slate-900 text-white border-none rounded-xl text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 outline-none shadow-sm cursor-pointer hover:bg-blue-600 transition-colors"
                        >
                            <option value="NEW">New Lead</option>
                            <option value="CONTACTED">Active Discovery</option>
                            <option value="QUALIFIED">Qualified Org</option>
                            <option value="SPAM">Discarded</option>
                        </select>
                    </td>
                    <td className="px-6 py-6 font-black text-[10px] text-slate-400 uppercase tracking-widest italic leading-none">
                        {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-10 py-6 text-right">
                        <button 
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-3 bg-white text-slate-300 hover:text-red-500 rounded-[14px] border border-slate-100 hover:shadow-xl transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === "PLANS" ? (
          <div className="p-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                <div>
                    <h2 className="text-2xl font-black tracking-tighter italic text-slate-900">Commercial Architectural Packages</h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1 italic">Control global licensing, agent quotas, and enterprise addons</p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={async () => {
                            if (!confirm("Re-seed global default packages?")) return
                            await fetch("/api/auth/seed-plans?secret=aiclex-master-setup-2026")
                            fetchData()
                        }}
                        className="px-8 py-3.5 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic hover:bg-slate-50 transition-all shadow-sm"
                    >
                        Sync World-Standard Hub
                    </button>
                    <button 
                        onClick={() => { setSelectedPlan(null); setShowPlanModal(true); }}
                        className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Plus size={16}/> Forge New Package
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(plans || []).map(plan => (
                    <div key={plan.id} className="bg-white border border-slate-100 rounded-[40px] p-10 relative overflow-hidden group shadow-sm hover:shadow-2xl transition-all">
                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => { setSelectedPlan(plan); setShowPlanModal(true); }} className="p-3 bg-slate-900 shadow-xl rounded-2xl text-white hover:bg-blue-600 transition-all active:scale-90"><Settings size={18}/></button>
                        </div>
                        
                        <div className="flex items-center gap-5 mb-10">
                            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:rotate-3 transition-transform">
                                <Package size={28} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight text-slate-900">{plan.name}</h3>
                                <p className="text-[9px] font-black uppercase text-blue-600 tracking-[0.2em] italic">SKU: {plan.stripePriceId || 'LOCAL_ONLY'}</p>
                            </div>
                        </div>

                        <div className="space-y-5 mb-10">
                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                                <span>Monthly Licensing</span>
                                <span className="font-black text-slate-900 flex items-center gap-1 text-sm tracking-tight"><IndianRupee size={12}/> {plan.monthlyPrice}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                                <span>Global Agent Quota</span>
                                <span className="font-black text-slate-900 text-sm tracking-tight">{plan.maxAgents} Nodes</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-600 w-1/2 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="p-12">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                <div>
                    <h2 className="text-2xl font-black tracking-tighter italic text-slate-900">Promotional Campaigns & Keys</h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1 italic">Generate high-authority bypass codes for elite agency onboarding</p>
                </div>
                <button 
                    onClick={() => setShowCouponModal(true)}
                    className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic shadow-2xl shadow-slate-900/20 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus size={16}/> Forge Master Key
                </button>
            </div>

            <div className="overflow-x-auto px-4 pb-4">
                <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead>
                        <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">
                            <th className="px-8 pb-4">Master Key</th>
                            <th className="px-6 pb-4">Unlocked Architecture</th>
                            <th className="px-6 pb-4">Node Utilization</th>
                            <th className="px-6 pb-4">Expiry Timeline</th>
                            <th className="px-6 pb-4">Status</th>
                            <th className="px-8 pb-4"></th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {coupons.map((coupon) => (
                            <tr key={coupon.id} className="bg-slate-50/50 hover:bg-slate-50 transition-all group overflow-hidden">
                                <td className="px-8 py-6 first:rounded-l-[24px]">
                                    <span className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs tracking-[0.3em] uppercase shadow-lg group-hover:bg-blue-600 transition-colors">
                                        {coupon.code}
                                    </span>
                                </td>
                                <td className="px-6 py-6 font-black text-sm text-slate-900 italic tracking-tight">
                                    {coupon.plan?.name} Package
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{coupon.usedCount} / {coupon.maxUses} Activations</span>
                                        <div className="w-32 h-1.5 bg-white rounded-full overflow-hidden border border-slate-100 shadow-inner">
                                            <div 
                                                className="h-full bg-blue-600 transition-all shadow-[0_0_8px_rgba(37,99,235,0.4)]" 
                                                style={{ width: `${(coupon.usedCount / coupon.maxUses) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 font-black text-[10px] text-slate-400 uppercase tracking-widest italic">
                                    {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "ETERNAL KEY"}
                                </td>
                                <td className="px-6 py-6">
                                    <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm ${
                                        coupon.isActive ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                                    }`}>
                                        {coupon.isActive ? "Operational" : "Disabled"}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right last:rounded-r-[24px]">
                                    <button 
                                        onClick={async () => {
                                            if (!confirm("Destroy this master key?")) return
                                            await fetch(`/api/super-admin/coupons/${coupon.id}`, { method: "DELETE" })
                                            fetchData()
                                        }}
                                        className="p-3 bg-white text-slate-300 hover:text-red-500 rounded-2xl border border-slate-100 hover:shadow-xl transition-all opacity-0 group-hover:opacity-100 active:scale-90"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-10 py-20 text-center text-slate-300 font-black italic uppercase tracking-widest text-sm">
                                    No promotional keys forged in this cluster.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        )}
      </div>
      
      {showPlanModal && (
        <PlanModal 
          onClose={() => setShowPlanModal(false)}
          onSave={() => fetchData()}
          plan={selectedPlan}
        />
      )}

      {showCouponModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
              <div className="bg-white w-full max-w-md rounded-[48px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
                  <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                      <div>
                          <h2 className="text-2xl font-black tracking-tighter italic text-slate-900">Forge Master Key</h2>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1 italic">Configure node authorization & parity</p>
                      </div>
                      <button onClick={() => setShowCouponModal(false)} className="p-3 hover:bg-slate-200 rounded-2xl transition-all">
                          <X size={20} className="text-slate-400" />
                      </button>
                  </div>
                  
                  <form className="p-10 space-y-6" onSubmit={async (e) => {
                      e.preventDefault()
                      const formData = new FormData(e.currentTarget)
                      const data = Object.fromEntries(formData.entries())
                      
                      const res = await fetch("/api/super-admin/coupons", {
                          method: "POST",
                          body: JSON.stringify(data)
                      })
                      
                      if (res.ok) {
                          setShowCouponModal(false)
                          fetchData()
                      } else {
                          const err = await res.json()
                          alert(err.error || "Failed to forge master key")
                      }
                  }}>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Mission Key Code</label>
                          <input 
                            name="code" 
                            required 
                            placeholder="ELITE-NODE-2026"
                            className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-black focus:ring-4 focus:ring-blue-600/5 outline-none transition-all uppercase tracking-widest placeholder:text-slate-300"
                          />
                      </div>

                      <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Architecture Unlock</label>
                          <select 
                            name="planId" 
                            required
                            className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-black focus:ring-4 focus:ring-blue-600/5 outline-none transition-all appearance-none"
                          >
                              {plans.filter(p => p.isPublic).map(p => (
                                  <option key={p.id} value={p.id}>{p.name} Package</option>
                              ))}
                          </select>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Activation Limit</label>
                            <input 
                                type="number"
                                name="maxUses" 
                                defaultValue={10}
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-black focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Decommission Date</label>
                            <input 
                                type="date"
                                name="expiresAt" 
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-black focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
                            />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black flex items-center justify-center gap-4 shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.3em] text-[10px] mt-6 italic"
                      >
                          Deploy Master Key <ArrowUpRight className="h-4 w-4" />
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  )
}
