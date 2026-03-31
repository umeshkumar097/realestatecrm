"use client"

import { useState, useEffect } from "react"
import { 
  Users, Mail, Phone, Building2, 
  MessageSquare, Calendar, Loader2,
  Trash2, CheckCircle2, Clock, XCircle,
  ExternalLink, Search, Filter
} from "lucide-react"
import { cn } from "@/lib/utils"

const statuses = [
    { value: "NEW", label: "New", icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
    { value: "CONTACTED", label: "Contacted", icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-50" },
    { value: "CLOSED", label: "Closed", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
    { value: "SPAM", label: "Spam", icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
]

export default function PlatformLeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")

  const loadLeads = async () => {
    try {
      const res = await fetch("/api/super-admin/platform-leads")
      if (res.ok) setLeads(await res.json())
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  useEffect(() => { loadLeads() }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/super-admin/platform-leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      })
      if (res.ok) loadLeads()
    } catch (e) { alert("Failed to update status") }
  }

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return
    try {
      const res = await fetch("/api/super-admin/platform-leads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      })
      if (res.ok) loadLeads()
    } catch (e) { alert("Delete failed") }
  }

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.phone.includes(searchTerm) ||
        (l.company || "").toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "ALL" || l.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Sales Inquiries</h1>
          <p className="text-zinc-500 text-sm">Leads captured from the PropGOCrm landing page.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input 
                    type="text"
                    placeholder="Search leads..."
                    className="pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none w-64 font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <select 
                className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none font-medium cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
            >
                <option value="ALL">All Statuses</option>
                {statuses.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredLeads.map((lead) => {
          const statusConfig = statuses.find(s => s.value === lead.status) || statuses[0]
          return (
            <div key={lead.id} className="bg-white border border-zinc-200 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                        {lead.name}
                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", statusConfig.bg, statusConfig.color)}>
                            {statusConfig.label}
                        </span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="text-sm font-medium text-zinc-500 flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" /> {lead.email}
                        </span>
                        <span className="text-sm font-medium text-zinc-500 flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" /> {lead.phone}
                        </span>
                        {lead.company && (
                            <span className="text-sm font-medium text-zinc-500 flex items-center gap-1.5">
                                <Building2 className="h-3.5 w-3.5" /> {lead.company}
                            </span>
                        )}
                        <span className="text-sm font-medium text-zinc-500 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" /> {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-1 lg:max-w-md">
                    <div className="flex-1 bg-zinc-50 rounded-2xl p-4 text-xs font-medium text-zinc-600 min-w-0">
                         <span className="font-black text-[9px] uppercase tracking-widest text-zinc-400 block mb-1">Message / Requirements</span>
                         <p className="line-clamp-2 italic">“{lead.message || "No specific message provided."}”</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <select 
                            className="px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none cursor-pointer hover:bg-zinc-100 transition-colors"
                            value={lead.status}
                            onChange={(e) => updateStatus(lead.id, e.target.value)}
                        >
                            {statuses.map(s => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                        <button 
                            onClick={() => deleteLead(lead.id)}
                            className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>
              </div>
            </div>
          )
        })}

        {filteredLeads.length === 0 && (
          <div className="py-20 text-center bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200">
            <Users className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-zinc-800">No leads found</h3>
            <p className="text-zinc-500 max-w-xs mx-auto mt-2">Adjust your filters or search terms to find specific inquiries.</p>
          </div>
        )}
      </div>
    </div>
  )
}
