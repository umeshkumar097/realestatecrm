"use client"
import { useState, useEffect } from "react"
import { 
  Building2, Users, CreditCard, 
  Search, ShieldCheck, Globe, 
  ExternalLink, MoreVertical,
  Calendar, ArrowUpRight, Activity,
  IndianRupee, Mail, Phone, X
} from "lucide-react"

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<"AGENCIES" | "PLATFORM_LEADS">("AGENCIES")
  const [agencies, setAgencies] = useState<any[]>([])
  const [platformLeads, setPlatformLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchData = async () => {
    try {
      const [agenciesRes, statsRes, platformLeadsRes] = await Promise.all([
        fetch("/api/super-admin/agencies"),
        fetch("/api/super-admin/stats"),
        fetch("/api/super-admin/platform-leads")
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
    } catch (err) {
      console.error("Failed to fetch superadmin data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const [globalStats, setGlobalStats] = useState<any>(null)

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
                          {agency.subdomain || "master"}.aiclex.in
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5" title="Users">
                          <Users className="h-3.5 w-3.5 text-zinc-400" />
                          <span className="text-xs font-bold text-zinc-700">{agency._count.users}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Leads">
                          <Activity className="h-3.5 w-3.5 text-zinc-400" />
                          <span className="text-xs font-bold text-zinc-700">{agency._count.leads}</span>
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
                          <p className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
                              <ShieldCheck className="h-2.5 w-2.5" />
                              {agency.subscription?.status || "OPEN"}
                          </p>
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
                          <button className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400 hover:text-zinc-900">
                              <MoreVertical className="h-4 w-4" />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}
