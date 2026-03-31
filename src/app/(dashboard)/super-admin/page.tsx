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
  const [activeTab, setActiveTab] = useState<"AGENCIES" | "PLATFORM_LEADS" | "PLANS">("AGENCIES")
  const [agencies, setAgencies] = useState<any[]>([])
  const [platformLeads, setPlatformLeads] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [globalStats, setGlobalStats] = useState<any>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [agenciesRes, statsRes, platformLeadsRes, plansRes] = await Promise.all([
        fetch("/api/super-admin/agencies"),
        fetch("/api/super-admin/stats"),
        fetch("/api/super-admin/platform-leads"),
        fetch("/api/super-admin/plans")
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
        setPlatformLeads(data.leads)
      }

      if (plansRes.ok) {
        const data = await plansRes.json()
        setPlans(data.plans)
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight italic">PropGOCrm Command Center</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Global oversight of all agencies, portal integrations, and enterprise inquiries.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder={`Search ${activeTab === 'AGENCIES' ? 'agencies' : 'leads'}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all w-64 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Stats row can stay same or add lead count */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {/* ...stats same... */}
      </div>

      <div className="flex items-center gap-1 bg-zinc-100 p-1.5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab("AGENCIES")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "AGENCIES" ? "bg-white text-primary shadow-sm" : "text-zinc-500 hover:text-zinc-900"}`}
          >
            Registered Agencies
          </button>
          <button 
            onClick={() => setActiveTab("PLATFORM_LEADS")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "PLATFORM_LEADS" ? "bg-white text-primary shadow-sm" : "text-zinc-500 hover:text-zinc-900"}`}
          >
            Platform Inquiries {platformLeads.length > 0 && <span className="ml-1 bg-primary text-white px-1.5 py-0.5 rounded-full text-[8px]">{platformLeads.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab("PLANS")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "PLANS" ? "bg-white text-primary shadow-sm" : "text-zinc-500 hover:text-zinc-900"}`}
          >
            Subscription Plans
          </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {activeTab === "AGENCIES" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Agency Details</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Subdomain</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Users/Leads</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Plan Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Joined</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredAgencies.map((agency) => (
                  <tr key={agency.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center font-black text-zinc-400 uppercase">
                          {agency.logo ? <img src={agency.logo} className="w-full h-full object-cover rounded-lg" /> : agency.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-zinc-800">{agency.name}</p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase">{agency.id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-zinc-600 text-sm font-bold">
                          <Globe className="h-3.5 w-3.5 text-zinc-400" />
                          {agency.subdomain || "master"}.propgocrm.com
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5" title="Users">
                          <Users className="h-3.5 w-3.5 text-zinc-400" />
                          <span className="text-xs font-bold text-zinc-700">{agency._count?.users || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Leads">
                          <Activity className="h-3.5 w-3.5 text-zinc-400" />
                          <span className="text-xs font-bold text-zinc-700">{agency._count?.leads || 0}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                              agency.subscription?.status === "ACTIVE" 
                                  ? "bg-emerald-100 text-emerald-700" 
                                  : "bg-zinc-100 text-zinc-600"
                          }`}>
                              {agency.plan?.name || "Free Trial"}
                          </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs font-bold text-zinc-500">
                          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-zinc-300" /> {new Date(agency.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400 hover:text-zinc-900">
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
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Inquirer</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Contacts</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Company</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Inquired On</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredPlatformLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4">
                        <p className="text-sm font-black text-zinc-800">{lead.name}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{lead.plan}</p>
                    </td>
                    <td className="px-6 py-4">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-zinc-700 flex items-center gap-1.5"><Mail className="h-3 w-3 text-zinc-300" /> {lead.email}</p>
                            <p className="text-xs font-bold text-zinc-700 flex items-center gap-1.5"><Phone className="h-3 w-3 text-zinc-300" /> {lead.phone}</p>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <p className="text-sm font-black text-blue-600">{lead.company || "N/A"}</p>
                        {lead.message && <p className="text-[10px] text-zinc-400 italic line-clamp-1 max-w-xs">{lead.message}</p>}
                    </td>
                    <td className="px-6 py-4">
                        <select 
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            className="bg-zinc-100 border-none rounded-lg text-[10px] font-black uppercase tracking-widest px-2 py-1 outline-none"
                        >
                            <option value="NEW">New Inq</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="QUALIFIED">Qualified</option>
                            <option value="SPAM">Spam</option>
                        </select>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-zinc-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button 
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-2 hover:bg-red-50 text-zinc-400 hover:text-red-600 rounded-lg transition-all opacity-40 group-hover:opacity-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-black tracking-tight italic">Commercial Packages</h2>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Control pricing, limits and addons</p>
                </div>
                <button 
                    onClick={() => { setSelectedPlan(null); setShowPlanModal(true); }}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black italic tracking-tight shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus size={18}/> New Package
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div key={plan.id} className="bg-zinc-50 border border-zinc-100 rounded-[32px] p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setSelectedPlan(plan); setShowPlanModal(true); }} className="p-2 bg-white shadow-sm rounded-xl text-zinc-400 hover:text-primary transition-colors"><Settings size={18}/></button>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <Package size={24} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black tracking-tight italic">{plan.name}</h3>
                                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{plan.stripePriceId || 'NO STRIPE ID'}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
                                <span>Monthly Price</span>
                                <span className="font-black italic text-zinc-900 flex items-center gap-0.5"><IndianRupee size={12}/> {plan.monthlyPrice}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
                                <span>Agent Limit</span>
                                <span className="font-black italic text-zinc-900">{plan.maxAgents} Agents</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
                                <span>Lead Limit</span>
                                <span className="font-black italic text-zinc-900">{plan.maxLeads} /mo</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                             <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-3">Included Services</p>
                             {plan.features?.slice(0, 3).map((f: string, i: number) => (
                                 <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                                     <CheckCircle2 size={12} className="text-emerald-500" />
                                     {f}
                                 </div>
                             ))}
                             {plan.features?.length > 3 && <p className="text-[10px] font-bold text-primary italic">+{plan.features.length - 3} more services...</p>}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
