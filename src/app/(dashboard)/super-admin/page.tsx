"use client"
import { useState, useEffect } from "react"
import { 
  Building2, Users, CreditCard, 
  Search, ShieldCheck, Globe, 
  ExternalLink, MoreVertical,
  Calendar, ArrowUpRight, Activity,
  IndianRupee
} from "lucide-react"

export default function SuperAdminPage() {
  const [agencies, setAgencies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const [agenciesRes, statsRes] = await Promise.all([
          fetch("/api/super-admin/agencies"),
          fetch("/api/super-admin/stats")
        ])
        
        if (agenciesRes.ok) {
          const data = await agenciesRes.json()
          setAgencies(data.agencies)
        }
        
        if (statsRes.ok) {
          const data = await statsRes.json()
          setGlobalStats(data.stats)
        }
      } catch (err) {
        console.error("Failed to fetch superadmin data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const [globalStats, setGlobalStats] = useState<any>(null)

  const filteredAgencies = agencies.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.domain || "").toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">System Master Control</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Manage all registered agencies and their subscription plans.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search agencies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all w-64 shadow-sm"
            />
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
            <Activity className="h-4 w-4" /> Global Logs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6" />
            </div>
            <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Agencies</p>
                <p className="text-2xl font-black">{globalStats?.totalAgencies || "..."}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6" />
            </div>
            <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Global Agents</p>
                <p className="text-2xl font-black">{globalStats?.totalAgents || "..."}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <IndianRupee className="h-6 w-6" />
            </div>
            <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Estimated MRR</p>
                <p className="text-2xl font-black">{globalStats?.revenue || "₹0L"}</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
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
                            {agency.subscription?.plan || "No Plan"}
                        </span>
                        <p className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
                            <ShieldCheck className="h-2.5 w-2.5" />
                            {agency.subscription?.status || "PENDING"}
                        </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs font-bold text-zinc-500">
                        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-zinc-300" /> {new Date(agency.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
      </div>
    </div>
  )
}
