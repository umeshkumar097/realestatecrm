"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  Users, Search, Filter, Plus, 
  MessageSquare, Phone, MoreHorizontal,
  Mail, Calendar, ArrowUpRight, 
  ChevronRight, BadgeInfo, Building2, X,
  Clock, MapPin, CreditCard, Activity, Trash2, Edit3,
  FileDown, Upload, FileType
} from "lucide-react"
import * as XLSX from "xlsx"

export default function LeadsPage() {
  const { data: session } = useSession()
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", budget: "", location: "" })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<any>(null)
  
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [bulkData, setBulkData] = useState("")
  const [activities, setActivities] = useState<any[]>([])
  const [activityLoading, setActivityLoading] = useState(false)
  const [activityForm, setActivityForm] = useState({ type: "CALL", content: "" })
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [loggingActivity, setLoggingActivity] = useState(false)
  const [drawerError, setDrawerError] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ total: 0, pages: 1 })

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false)
  const [broadcastMessage, setBroadcastMessage] = useState("")
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  const loadLeads = async () => {
    try {
      let url = `/api/leads?page=${page}&limit=100`
      if (statusFilter !== "ALL") url += `&status=${statusFilter}`
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`
      
      const res = await fetch(url)
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to fetch")
      }
      const data = await res.json()
      setLeads(data.leads || [])
      setMeta({ total: data.total, pages: data.pages })
    } catch (err: any) {
      console.error("Failed to load clients", err)
      if (err.message !== "Failed to fetch") alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadActivities = async (leadId: string) => {
    setActivityLoading(true)
    try {
      const res = await fetch(`/api/activities?leadId=${leadId}`)
      if (res.ok) {
        const data = await res.json()
        setActivities(data)
      }
    } catch (err) {
      console.error("Failed to load activities", err)
    } finally {
      setActivityLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1) // Reset to page 1 on new filter or search
      loadLeads()
    }, 300)
    return () => clearTimeout(timer)
  }, [statusFilter, searchQuery, page])

  useEffect(() => {
    if (selectedLead) {
      loadActivities(selectedLead.id)
    }
  }, [selectedLead])

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setSelectedLead(null)
        loadLeads()
      }
    } catch (err) {
      alert("Failed to delete lead")
    }
  }

  const updateLeadStatus = async (id: string, newStatus: string) => {
    setUpdatingStatus(newStatus)
    setDrawerError(null)
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setSelectedLead({...selectedLead, status: newStatus})
        loadLeads()
      } else {
        const err = await res.json().catch(() => ({ error: "Failed to update status" }))
        setDrawerError(err.error)
      }
    } catch (err: any) {
      setDrawerError(err.message)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const bstr = evt.target?.result
      const wb = XLSX.read(bstr, { type: "binary" })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 })
      
      // Assume format: Name, Phone, Email, Budget, Location
      // Skip header row if it looks like one
      const rows = data.slice(1).filter(r => r[1]) // r[1] is phone
      const formatted = rows.map(r => `${r[0] || ""}, ${r[1] || ""}, ${r[2] || ""}, ${r[3] || ""}, ${r[4] || ""}`).join("\n")
      setBulkData(formatted)
    }
    reader.readAsBinaryString(file)
  }

  const downloadSample = () => {
    const data = [
      ["Name", "Phone", "Email", "Budget", "Location"],
      ["John Doe", "9876543210", "john@example.com", "₹50L", "Noida"],
      ["Jane Smith", "9876543211", "jane@example.com", "₹1.2Cr", "Gurgaon"]
    ]
    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Clients")
    XLSX.writeFile(wb, "crm_clients_template.xlsx")
  }

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const rows = bulkData.split("\n").filter(r => r.trim())
      const clients = rows.map(r => {
        const parts = r.split(",")
        return { 
          name: parts[0]?.trim() || "Bulk Client", 
          phone: parts[1]?.trim() || "", 
          email: parts[2]?.trim() || "", 
          budget: parts[3]?.trim() || "", 
          location: parts[4]?.trim() || "" 
        }
      }).filter(l => l.phone)

      if (clients.length === 0) throw new Error("No valid phone numbers found")

      const res = await fetch("/api/leads/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: clients }), // API still uses 'leads' key
      })
      if (res.ok) {
        const result = await res.json()
        setIsBulkModalOpen(false)
        setBulkData("")
        loadLeads()
        alert(`${result.created} Clients uploaded successfully.` + (result.skipped > 0 ? ` (${result.skipped} skipped/duplicates)` : ""))
        console.log("[Bulk Upload Results]:", result)
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload clients. Use format: Name, Phone, Email, Budget, Location")
    }
  }

  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLead || !activityForm.content.trim()) return
    setLoggingActivity(true)
    setDrawerError(null)
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          leadId: selectedLead.id,
          type: activityForm.type,
          content: activityForm.content
        }),
      })
      if (res.ok) {
        setActivityForm({ ...activityForm, content: "" })
        loadActivities(selectedLead.id)
      } else {
        const err = await res.json().catch(() => ({ error: "Failed to log activity" }))
        setDrawerError(err.error)
      }
    } catch (err: any) {
      setDrawerError(err.message)
    } finally {
      setLoggingActivity(false)
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === leads.length && leads.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(leads.map(l => l.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} selected clients? This cannot be undone.`)) return
    
    setIsBulkDeleting(true)
    try {
      const res = await fetch("/api/leads/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      })
      if (res.ok) {
        setSelectedIds(new Set())
        loadLeads()
      } else {
        const err = await res.json()
        alert(err.error || "Failed to delete clients")
      }
    } catch (err) {
      alert("Failed to delete clients")
    } finally {
      setIsBulkDeleting(false)
    }
  }

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) return
    setIsBroadcasting(true)
    try {
      const res = await fetch("/api/whatsapp/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ids: Array.from(selectedIds),
          message: broadcastMessage
        }),
      })
      const data = await res.json()
      if (res.ok) {
        alert(`Broadcast Summary:\n- Successfully Sent: ${data.success}\n- Failed: ${data.failed}\nTotal: ${data.total}`)
        setIsBroadcastModalOpen(false)
        setBroadcastMessage("")
        setSelectedIds(new Set())
      } else {
        alert(data.error || "Broadcast failed")
      }
    } catch (err) {
      alert("Error sending broadcast")
    } finally {
      setIsBroadcasting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setIsModalOpen(false)
        setFormData({ name: "", phone: "", email: "", budget: "", location: "" })
        loadLeads()
      }
    } catch (err) {
      alert("Failed to create client")
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingLead) return
    try {
      const res = await fetch(`/api/leads/${editingLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setIsEditModalOpen(false)
        setEditingLead(null)
        setFormData({ name: "", phone: "", email: "", budget: "", location: "" })
        loadLeads()
      }
    } catch (err) {
      alert("Failed to update client")
    }
  }

  const filteredLeads = leads

  if (loading && leads.length === 0) return (
     <div className="flex items-center justify-center h-full min-h-[400px]">
       <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
     </div>
  )

  return (
    <div className="space-y-6 relative min-h-screen pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Global Ingress Control</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1 italic">Monitoring {meta.total} active engagement nodes within the global cluster</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-3 px-6 py-3.5 border border-slate-100 bg-white rounded-full text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic hover:bg-slate-50 hover:shadow-xl transition-all active:scale-95 shadow-sm"
          >
             <Filter className="h-4 w-4" /> Filter {statusFilter !== 'ALL' && <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]" />}
          </button>
          <button 
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-3 px-6 py-3.5 border border-slate-100 bg-white rounded-full text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic hover:bg-slate-50 hover:shadow-xl transition-all active:scale-95 shadow-sm"
          >
             <Activity className="h-4 w-4" /> Bulk Ingress
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 px-8 py-3.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all"
          >
             <Plus className="h-4 w-4" /> Forge Node
          </button>
        </div>
      </div>

      <div className="flex items-center gap-5 p-1.5 bg-white border border-slate-100 rounded-full shadow-sm group focus-within:shadow-xl transition-all">
         <div className="flex-1 flex items-center gap-4 px-6 py-3 text-slate-300">
            <Search className="h-4 w-4 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search global engagement vector (name, phone or email)..." 
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-300 text-slate-800 placeholder:italic"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-6 w-12">
                  <input 
                    type="checkbox" 
                    className="rounded-lg border-slate-200 text-slate-900 focus:ring-slate-900 h-5 w-5 bg-white transition-all cursor-pointer"
                    checked={selectedIds.size === leads.length && leads.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Engagement Node</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Ingress Vector</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Lifecycle Status</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Governor</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Established</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic text-right">Node Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map((lead: any) => (
                <tr 
                  key={lead.id} 
                  onClick={() => setSelectedLead(lead)}
                  className={`hover:bg-slate-50/80 transition-all group cursor-pointer ${selectedIds.has(lead.id) ? 'bg-blue-50/20' : ''}`}
                >
                  <td className="px-6 py-8" onClick={e => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="rounded-lg border-slate-200 text-slate-900 focus:ring-slate-900 h-5 w-5 bg-white transition-all cursor-pointer"
                      checked={selectedIds.has(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                    />
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-50 flex items-center justify-center text-slate-400 font-extrabold text-sm uppercase shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                         {lead.name?.charAt(0) || "L"}
                       </div>
                       <div>
                         <p className="text-sm font-black text-slate-900 tracking-tight">{lead.name || lead.phone}</p>
                         <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] italic flex items-center gap-1.5 mt-1.5 opacity-70"><Phone className="h-3 w-3" /> {lead.phone}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10"><MessageSquare className="h-4 w-4" /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">{lead.source || 'WHATSAPP'}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5 italic">Ingress Vector</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    {(() => {
                      const colors: any = {
                        NEW: "bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]",
                        CONNECTED: "bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]",
                        NOT_CONNECTED: "bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.4)]",
                        QUALIFIED: "bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]",
                        NOT_QUALIFIED: "bg-slate-300 text-white shadow-sm",
                        SITE_VISIT: "bg-amber-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.4)]",
                        CONVERTED: "bg-slate-900 text-white shadow-[0_0_12px_rgba(15,23,42,0.4)]",
                        LOST: "bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                      }
                      return (
                        <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] italic border-none ${colors[lead.status] || "bg-slate-200"}`}>
                          {lead.status}
                        </span>
                      )
                    })()}
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-50 uppercase">
                         {lead.assignedTo?.name?.charAt(0) || "G"}
                       </div>
                       <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.1em]">{lead.assignedTo?.name || "Independent Hub"}</p>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                        {new Date(lead.updatedAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-6 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" onClick={e => e.stopPropagation()}>
                       <button 
                         onClick={() => {
                           setEditingLead(lead)
                           setFormData({ name: lead.name, phone: lead.phone, email: lead.email || "", budget: lead.budget || "", location: lead.location || "" })
                           setIsEditModalOpen(true)
                         }}
                         className="p-3 bg-white shadow-xl rounded-[14px] text-slate-400 hover:text-blue-600 border border-slate-100 transition-all active:scale-90"
                       >
                         <Edit3 className="h-4 w-4" />
                       </button>
                       <button 
                         onClick={() => deleteLead(lead.id)}
                         className="p-3 bg-white shadow-xl rounded-[14px] text-slate-400 hover:text-rose-600 border border-slate-100 transition-all active:scale-90"
                       >
                         <Trash2 className="h-4 w-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLeads.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-100">
               <Users className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight italic">No Engagement Nodes Found</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 max-w-sm mx-auto italic">Initializing WhatsApp bridge will automatically populate this world-standard sync cluster.</p>
          </div>
        )}
        
        {meta.pages > 1 && (
          <div className="px-10 py-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Cluster Page {page} of {meta.pages}</p>
            <div className="flex gap-4">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-8 py-3 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-30 hover:bg-slate-50 hover:shadow-xl transition-all italic"
              >Previous Phase</button>
              <button 
                disabled={page === meta.pages}
                onClick={() => setPage(p => p + 1)}
                className="px-8 py-3 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-30 hover:bg-slate-50 hover:shadow-xl transition-all italic"
              >Next Phase</button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Drawer */}
      <div className={`fixed inset-y-0 right-0 z-[120] w-96 bg-white/90 backdrop-blur-2xl shadow-[-20px_0_60px_rgba(0,0,0,0.1)] border-l border-white/20 transform transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isFilterOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-10 h-full flex flex-col">
          <div className="flex items-center justify-between mb-12">
            <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">Vector Filter</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1 italic">Refine Engagement Cluster</p>
            </div>
            <button onClick={() => setIsFilterOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-all"><X className="h-5 w-5 text-slate-400" /></button>
          </div>
          <div className="space-y-10 flex-1 overflow-y-auto pr-4 custom-scrollbar">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 italic">Lifecycle State</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setStatusFilter("ALL"); setIsFilterOpen(false); }}
                  className={`w-full px-6 py-4 rounded-[18px] text-[10px] font-black italic uppercase tracking-[0.2em] text-left transition-all ${statusFilter === 'ALL' ? 'bg-slate-900 text-white shadow-2xl' : 'hover:bg-slate-50 text-slate-500 border border-slate-100 shadow-sm'}`}
                >ALL NODES</button>
                {['NEW', 'CONNECTED', 'NOT_CONNECTED', 'QUALIFIED', 'NOT_QUALIFIED', 'SITE_VISIT', 'CONVERTED', 'LOST'].map(s => (
                  <button 
                    key={s}
                    onClick={() => { setStatusFilter(s); setIsFilterOpen(false); }}
                    className={`w-full px-6 py-4 rounded-[18px] text-[10px] font-black italic uppercase tracking-[0.2em] text-left transition-all ${statusFilter === s ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/20' : 'hover:bg-slate-50 text-slate-500 border border-slate-100 shadow-sm'}`}
                  >{s.replace('_', ' ')} Stage</button>
                ))}
              </div>
            </div>
          </div>
          <button 
            onClick={() => { setStatusFilter("ALL"); setIsFilterOpen(false); }}
            className="mt-8 w-full py-4 text-[10px] font-black text-slate-300 hover:text-slate-900 transition-all uppercase tracking-[0.3em] italic"
          >Reset All Nodes</button>
        </div>
      </div>

      {/* Detail Drawer */}
      <div className={`fixed inset-y-0 right-0 z-[120] w-[500px] bg-white shadow-[-20px_0_80px_rgba(0,0,0,0.15)] border-l border-slate-50 transform transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${selectedLead ? "translate-x-0" : "translate-x-full"}`}>
        {selectedLead && (
          <div className="p-10 h-full flex flex-col overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">Node Insights</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1 italic">Full Cluster Analysis & Action Logs</p>
              </div>
              <button onClick={() => { setSelectedLead(null); setDrawerError(null); }} className="p-3 hover:bg-slate-50 rounded-2xl transition-all"><X className="h-5 w-5 text-slate-400" /></button>
            </div>

            {drawerError && (
              <div className="mb-10 p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-start gap-4 animate-in slide-in-from-top-4 duration-300">
                <BadgeInfo className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-rose-700 uppercase tracking-[0.2em] italic">System Error</p>
                  <p className="text-[11px] text-rose-600 mt-1.5 font-bold italic">{drawerError}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 font-black text-3xl border border-white shadow-inner">
                {selectedLead.name?.charAt(0) || "L"}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">{selectedLead.name || selectedLead.phone}</h3>
                <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] italic mt-2.5 flex items-center gap-2 opacity-80"><Phone className="h-3 w-3" /> {selectedLead.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 italic flex items-center gap-2"><Activity className="h-3 w-3" /> Lifecycle State</p>
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{selectedLead.status}</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 italic flex items-center gap-2"><MessageSquare className="h-3 w-3" /> Ingress Vector</p>
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{selectedLead.source || 'WHATSAPP_SYNC'}</p>
              </div>
            </div>

            <div className="mb-12">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5 italic">Transition Node Stage</p>
              <div className="flex flex-wrap gap-3">
                {['NEW', 'CONNECTED', 'NOT_CONNECTED', 'QUALIFIED', 'NOT_QUALIFIED', 'SITE_VISIT', 'CONVERTED', 'LOST'].map(s => (
                  <button 
                    key={s}
                    disabled={!!updatingStatus}
                    onClick={() => updateLeadStatus(selectedLead.id, s)}
                    className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 italic ${
                      selectedLead.status === s 
                        ? 'bg-slate-900 text-white shadow-2xl skew-x-[-10deg]' 
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'
                    } ${updatingStatus === s ? 'opacity-50' : ''}`}
                  >
                    {s.replace('_', ' ')}
                    {updatingStatus === s && <Clock className="h-3 w-3 animate-spin" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <h4 className="text-[10px] font-black text-slate-900 mb-5 flex items-center gap-3 uppercase tracking-[0.3em] italic">
                    <Activity className="h-4 w-4 text-blue-600" /> Operational Action Log
                </h4>
                <form onSubmit={handleLogActivity} className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex gap-3 mb-5">
                    {['CALL', 'MESSAGE', 'MEETING', 'NOTE'].map(t => (
                      <button 
                        key={t} type="button"
                        onClick={() => setActivityForm({...activityForm, type: t})}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] italic transition-all ${activityForm.type === t ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder={`Describe the global activity (${activityForm.type.toLowerCase()})...`}
                      className="flex-1 px-6 py-4 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:italic"
                      value={activityForm.content}
                      onChange={e => setActivityForm({...activityForm, content: e.target.value})}
                    />
                    <button 
                      type="submit" 
                      disabled={loggingActivity}
                      className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-blue-600 hover:scale-110 active:scale-95 disabled:opacity-50 transition-all"
                    >
                      {loggingActivity ? <Clock className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                    </button>
                  </div>
                </form>

                <div className="space-y-5 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                  {activityLoading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-20 bg-slate-50 rounded-3xl" />
                      <div className="h-20 bg-slate-50 rounded-3xl" />
                    </div>
                  ) : activities.length === 0 ? (
                    <div className="p-10 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em] italic">No cluster activity detected</p>
                    </div>
                  ) : (
                    activities.map((act: any) => (
                      <div key={act.id} className="relative pl-8 border-l-2 border-slate-50 pb-6 last:pb-0">
                        <div className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ring-4 ring-white ${act.type === 'CALL' ? 'bg-blue-500' : act.type === 'MEETING' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                        <div className="bg-white border border-slate-50 rounded-[24px] p-5 shadow-sm hover:shadow-xl transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em] italic">{act.type} Node Event</span>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em]">{new Date(act.createdAt).toLocaleDateString("en-IN", { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 font-bold leading-relaxed">{act.content}</p>
                          <div className="mt-3 flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 border border-slate-50">
                                {act.user?.name?.charAt(0) || "G"}
                              </div>
                              <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest italic leading-none">Log Governor: {act.user?.name || "Global Agent"}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-900 mb-4 flex items-center gap-3 uppercase tracking-[0.3em] italic"><BadgeInfo className="h-4 w-4 text-slate-400" /> Vector Profile Notes</h4>
                <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl text-[11px] font-bold text-slate-500 leading-relaxed min-h-[100px] italic">
                  {selectedLead.notes || "This engagement node was automatically initialized from the master WhatsApp bridge. Metadata parity is 100% stable."}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-900 mb-4 flex items-center gap-3 uppercase tracking-[0.3em] italic"><ArrowUpRight className="h-4 w-4 text-emerald-500" /> Architectural Intent</h4>
                <div className="grid gap-3">
                  <div className="flex justify-between p-4 bg-white border border-slate-50 rounded-2xl shadow-sm hover:border-emerald-100 transition-colors">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic"><Building2 className="h-3.5 w-3.5" /> Sector Type</span>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{selectedLead.propertyType || "Residential Hub"}</span>
                  </div>
                  <div className="flex justify-between p-4 bg-white border border-slate-50 rounded-2xl shadow-sm hover:border-blue-100 transition-colors">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic"><CreditCard className="h-3.5 w-3.5" /> Resource Budget</span>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">{selectedLead.budget || "Manual Ingress"}</span>
                  </div>
                  <div className="flex justify-between p-4 bg-white border border-slate-50 rounded-2xl shadow-sm hover:border-amber-100 transition-colors">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic"><MapPin className="h-3.5 w-3.5" /> High-Value Node</span>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">{selectedLead.location || "Global Region"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-50">
              <Link href="/dashboard/chat" className="w-full py-6 bg-slate-900 text-white rounded-[32px] text-[10px] font-black uppercase tracking-[0.3em] italic shadow-2xl shadow-slate-900/10 flex items-center justify-center gap-3 hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all">
                <MessageSquare className="h-5 w-5" /> Initialize Direct Comms
              </Link>
            </div>
          </div>
        )}
      </div>

      {(isFilterOpen || selectedLead) && (
        <div onClick={() => { setIsFilterOpen(false); setSelectedLead(null); }} className="fixed inset-0 z-[90] bg-slate-900/40 backdrop-blur-[3px] animate-in fade-in duration-300" />
      )}

      {/* Add/Edit Modal */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-6">
          <div className="bg-white rounded-[48px] p-10 w-full max-w-md shadow-2xl border border-slate-100 transform animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">{isEditModalOpen ? "Modify Node" : "Forge New Node"}</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1 italic">Cluster Authorization Required</p>
              </div>
              <button onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }} className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-400"><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={isEditModalOpen ? handleEditSubmit : handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Node Signature (Name)</label>
                <input type="text" placeholder="Gaurav Sharma" required className="w-full px-6 py-5 rounded-[24px] border border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none text-sm font-black placeholder:italic" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Comms Vector (Phone)</label>
                <input type="text" placeholder="+91 9876543210" required className="w-full px-6 py-5 rounded-[24px] border border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none text-sm font-black placeholder:italic" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Architectural Goal</label>
                    <input type="text" placeholder="₹2.5Cr" className="w-full px-6 py-5 rounded-[24px] border border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none text-sm font-black placeholder:italic" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Sector Region</label>
                    <input type="text" placeholder="Dubai Hills" className="w-full px-6 py-5 rounded-[24px] border border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none text-sm font-black placeholder:italic" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                 </div>
              </div>
              <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/10 hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.3em] text-[10px] mt-6 italic">
                {isEditModalOpen ? "Sync Modifications" : "Initialize engagement node"} <ArrowUpRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Ingress Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-6">
          <div className="bg-white rounded-[48px] p-12 w-full max-w-2xl shadow-2xl border border-slate-100 transform animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">Bulk Node Ingress</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1 italic">Cluster Expansion Protocol</p>
              </div>
              <button onClick={() => setIsBulkModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-400"><X className="h-7 w-7" /></button>
            </div>
            
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest italic">Excel / CSV / Manual Vector Data</p>
              <button onClick={downloadSample} className="flex items-center gap-2 text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-[0.2em] italic">
                <FileDown className="h-4 w-4" /> Download Node Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
               <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[32px] p-10 hover:bg-slate-50 hover:border-blue-200 transition-all cursor-pointer group shadow-sm">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <Upload className="h-7 w-7" />
                  </div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] italic">Upload Cluster Data</p>
                  <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-widest italic">XLSX / CSV Ingress</p>
                  <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleFileUpload} />
               </label>

               <div className="flex flex-col justify-center p-8 bg-slate-50/50 rounded-[32px] border border-slate-50 text-center shadow-inner">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileType className="h-6 w-6" />
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic leading-none mb-3">Manual Vector Mapping</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed italic px-4">Name, Phone, Email, Budget, Region (One per line)</p>
               </div>
            </div>

            <form onSubmit={handleBulkUpload} className="space-y-6">
              <textarea 
                placeholder="Paste engagement vectors: Gaurav, 9876543210, g@mail.com, ₹2.5Cr, Dubai hills..."
                className="w-full h-56 px-8 py-6 rounded-[32px] border border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none text-xs font-bold leading-relaxed placeholder:italic"
                value={bulkData}
                onChange={e => setBulkData(e.target.value)}
              />
              <div className="flex gap-4">
                <button type="button" onClick={() => setBulkData("")} className="flex-1 py-5 border border-slate-200 text-slate-400 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all italic">
                  Clear Node Buffer
                </button>
                <button type="submit" className="flex-[2] py-5 bg-slate-900 text-white rounded-[24px] font-black shadow-2xl hover:bg-blue-600 active:scale-95 transition-all uppercase tracking-[0.3em] text-[10px] italic">
                  Authorize Cluster Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[130] bg-slate-900/95 backdrop-blur-2xl text-white px-12 py-6 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex items-center gap-12 animate-in slide-in-from-bottom-12 duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] border border-white/10">
          <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] leading-none mb-2 italic">Active Nodes</span>
             <span className="text-2xl font-black italic tracking-tighter">{selectedIds.size} Captured</span>
          </div>
          
          <div className="h-12 w-[1px] bg-white/10" />
          
          <div className="flex items-center gap-6">
             <button 
               onClick={() => setIsBroadcastModalOpen(true)}
               className="flex items-center gap-3 px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic hover:scale-105 hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-blue-600/20"
             >
               <MessageSquare className="h-4 w-4" /> Initialize Comms
             </button>
             <button 
               onClick={handleBulkDelete}
               disabled={isBulkDeleting}
               className="flex items-center gap-3 px-8 py-3.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic hover:bg-rose-600 hover:text-white transition-all active:scale-95 disabled:opacity-50"
             >
               {isBulkDeleting ? <Clock className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Purge Nodes
             </button>
             <button 
               onClick={() => setSelectedIds(new Set())}
               className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] italic px-4 transition-colors"
             >
               Abort
             </button>
          </div>
        </div>
      )}

      {/* WhatsApp Broadcast Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-6">
          <div className="bg-white rounded-[48px] p-12 w-full max-w-lg shadow-[0_20px_80px_rgba(0,0,0,0.2)] border border-slate-100 transform animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Broadcast Hub</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1 italic italic">Transmitting to {selectedIds.size} Engagement Nodes</p>
              </div>
              <button onClick={() => setIsBroadcastModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-400"><X className="h-8 w-8" /></button>
            </div>
            
            <div className="space-y-8">
              <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50 flex items-start gap-5 shadow-sm">
                 <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl shadow-lg shadow-blue-600/10 flex-shrink-0"><BadgeInfo className="h-6 w-6" /></div>
                 <p className="text-[10px] text-blue-700 leading-relaxed font-black uppercase tracking-tighter italic">
                   Attention: Maintain operational conversationality. Avoid non-conversational vector links to prevent WhatsApp protocol blocking.
                 </p>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1 mb-3 block italic">Vector Signal Content</label>
                <textarea 
                  placeholder="Hi! This is the master agent from the prestige platform. We have a private node update for your sector..."
                  className="w-full h-48 px-8 py-6 rounded-[32px] border border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none text-sm font-bold leading-relaxed placeholder:italic"
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                />
              </div>

              <button 
                onClick={handleBroadcast}
                disabled={isBroadcasting || !broadcastMessage.trim()}
                className="w-full py-6 bg-emerald-500 text-white rounded-[32px] font-black shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-[10px] italic"
              >
                {isBroadcasting ? <Clock className="h-6 w-6 animate-spin" /> : <MessageSquare className="h-6 w-6" />}
                {isBroadcasting ? "Transmitting..." : "Initialize Global Broadcast"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
