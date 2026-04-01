"use client"
import { useState, useEffect } from "react"
import { 
  Building2, Users, Search, 
  ShieldCheck, ShieldAlert, MoreVertical,
  Calendar, Activity, Filter, Plus,
  CheckCircle2, XCircle, AlertTriangle, ShieldPlus
} from "lucide-react"

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAgency, setEditingAgency] = useState<any>(null)

  const fetchAgencies = async () => {
    try {
      const res = await fetch("/api/super-admin/agencies")
      if (res.ok) {
        const data = await res.json()
        setAgencies(data.agencies)
        setPlans(data.plans)
      }
    } catch (err) {
      console.error("Failed to fetch agencies", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgencies()
  }, [])

  const handleUpdateStatus = async (id: string, status?: string, planId?: string, name?: string, domain?: string) => {
    try {
      const res = await fetch("/api/super-admin/agencies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, planId, name, domain })
      })
      if (res.ok) {
        fetchAgencies()
        setShowEditModal(false)
      }
    } catch (err) {
      alert("Failed to update agency")
    }
  }

  const handleDeleteAgency = async (id: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY delete this agency? All data (users, leads, etc.) will be lost.")) return
    try {
      const res = await fetch("/api/super-admin/agencies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      })
      if (res.ok) fetchAgencies()
    } catch (err) {
      alert("Failed to delete agency")
    }
  }

  const handleUpgradeToLifetime = async (agencyId: string) => {
    if (!confirm("Upgrade this agency to a Permanent Lifetime Membership?")) return
    try {
      const lifetimePlan = plans.find(p => p.name === "Lifetime Member")
      if (!lifetimePlan) {
          alert("Lifetime plan not seeded. Please contact Dev.")
          return
      }
      
      const res = await fetch(`/api/super-admin/agencies/upgrade-manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agencyId: agencyId, planId: lifetimePlan.id })
      })
      if (res.ok) {
          alert("Agency upgraded to Lifetime successfully!")
          fetchAgencies()
      } else {
          const data = await res.json()
          alert(data.error || "Upgrade failed")
      }
    } catch (err) {
      alert("Error upgrading agency")
    }
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Agency Fleet</h1>
          <p className="text-zinc-500 text-sm">Monitor and manage all tenant agencies securely.</p>
        </div>
        <button 
            onClick={() => setShowRegisterModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
        >
            <Plus className="h-4 w-4" /> Register New Agency
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search by name, ID or domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-inner"
          />
        </div>
        <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
                <Filter className="h-3.5 w-3.5" /> All Status
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
                <ShieldCheck className="h-3.5 w-3.5" /> All Plans
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Agency & Identity</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Subscription</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Utilization</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Health Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredAgencies.map((agency) => (
                <tr key={agency.id} className="hover:bg-zinc-50/80 transition-colors group">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center font-black text-zinc-500 shadow-inner">
                        {agency.logo ? <img src={agency.logo} className="w-full h-full object-cover rounded-2xl" /> : agency.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-zinc-800">{agency.name}</p>
                        <p className="text-[10px] text-zinc-400 font-bold flex items-center gap-1 uppercase tracking-tighter">
                            {agency.subdomain || agency.id.slice(-8)}.aiclex.in
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <select 
                                value={agency.planId || ""} 
                                onChange={(e) => handleUpdateStatus(agency.id, undefined, e.target.value)}
                                className="text-xs font-black text-zinc-700 bg-transparent border-none focus:ring-0 cursor-pointer hover:underline"
                            >
                                <option value="">Free Trial</option>
                                {(plans || []).map((p: any) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 border border-zinc-200">
                                {agency.subscription?.status || "OPEN"}
                            </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">
                            {agency.plan?.name === "Lifetime Member" 
                                ? "LIFETIME ACCESS" 
                                : `Renewal: ${agency.subscription?.currentPeriodEnd ? new Date(agency.subscription.currentPeriodEnd).toLocaleDateString() : "Pending"}`
                            }
                        </p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="flex items-center gap-1.5">
                            <Users className="h-3 w-3 text-zinc-400" />
                            <span className="text-[11px] font-bold text-zinc-600">{agency._count.users}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Activity className="h-3 w-3 text-zinc-400" />
                            <span className="text-[11px] font-bold text-zinc-600">{agency._count.leads}</span>
                        </div>
                         <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-3 w-3 text-emerald-400" />
                            <span className="text-[11px] font-bold text-zinc-600">{agency._count.whatsappSessions}</span>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                            agency.status === "ACTIVE" ? "bg-emerald-500 animate-pulse" : 
                            agency.status === "SUSPENDED" ? "bg-amber-500" : "bg-zinc-400"
                        }`} />
                        <span className="text-xs font-black text-zinc-700 uppercase tracking-tight">{agency.status}</span>
                     </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center gap-2 justify-end">
                        {agency.status === "ACTIVE" ? (
                            <button 
                                onClick={() => handleUpdateStatus(agency.id, "SUSPENDED")}
                                className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors"
                                title="Suspend Agency"
                            >
                                <ShieldAlert className="h-4 w-4" />
                            </button>
                        ) : (
                            <button 
                                onClick={() => handleUpdateStatus(agency.id, "ACTIVE")}
                                className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                                title="Activate Agency"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                            </button>
                        )}
                        <button 
                            onClick={() => handleUpgradeToLifetime(agency.id)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                            title="Upgrade to Lifetime Member"
                        >
                            <ShieldPlus className="h-4 w-4" />
                        </button>
                        <div className="relative group/menu">
                            <button className="p-2 bg-zinc-50 text-zinc-400 rounded-xl hover:bg-zinc-100 transition-colors">
                                <MoreVertical className="h-4 w-4" />
                            </button>
                            <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover/menu:block z-20">
                                <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden py-1">
                                    <button 
                                        onClick={() => {
                                            setEditingAgency(agency)
                                            setShowEditModal(true)
                                        }}
                                        className="w-full px-4 py-2 text-left text-xs font-bold text-zinc-600 hover:bg-zinc-50 flex items-center gap-2"
                                    >
                                        Edit Details
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteAgency(agency.id)}
                                        className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        Delete Agency
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAgencies.length === 0 && (
            <div className="p-12 text-center">
                <Building2 className="h-12 w-12 text-zinc-200 mx-auto mb-3" />
                <p className="text-zinc-500 font-bold">No agencies found matching your search.</p>
            </div>
        )}
      </div>

      {showRegisterModal && (
        <div className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-zinc-200 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black">Register New Agency</h2>
                    <button onClick={() => setShowRegisterModal(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                        <XCircle className="h-6 w-6" />
                    </button>
                </div>
                <form className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const res = await fetch("/api/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(Object.fromEntries(formData))
                    })
                    if (res.ok) {
                        setShowRegisterModal(false)
                        fetchAgencies()
                    } else {
                        alert("Failed to register agency")
                    }
                }}>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-zinc-500">Agency Name</label>
                        <input name="agencyName" required className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="Elite Agency" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-zinc-500">Admin Name</label>
                        <input name="name" required className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="Umesh Kumar" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-zinc-500">Email Address</label>
                        <input name="email" type="email" required className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="umesh@agency.com" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-zinc-500">Password</label>
                        <input name="password" type="password" required className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all mt-4">Create Agency Account</button>
                </form>
            </div>
        </div>
      )}
      {showEditModal && editingAgency && (
        <div className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-zinc-200 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black">Edit Agency</h2>
                    <button onClick={() => setShowEditModal(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                        <XCircle className="h-6 w-6" />
                    </button>
                </div>
                <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    handleUpdateStatus(
                        editingAgency.id, 
                        undefined, 
                        undefined, 
                        formData.get("name") as string,
                        formData.get("domain") as string
                    )
                }}>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-zinc-500">Agency Name</label>
                        <input name="name" defaultValue={editingAgency.name} required className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-zinc-500">Custom Domain</label>
                        <input name="domain" defaultValue={editingAgency.domain || ""} className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all" placeholder="estate.com" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all mt-4">Save Changes</button>
                </form>
            </div>
        </div>
      )}
    </div>
  )
}
