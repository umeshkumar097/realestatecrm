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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Client Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Showing {leads.length} of {meta.total} clients.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
             <Filter className="h-4 w-4" /> Filter {statusFilter !== 'ALL' && <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
          </button>
          <button 
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
             <Activity className="h-4 w-4" /> Bulk Upload
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-extrabold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
          >
             <Plus className="h-4 w-4" /> Add Client
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
         <div className="flex-1 flex items-center gap-3 px-4 py-2 text-slate-400">
            <Search className="h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search by name, phone or email..." 
              className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 text-slate-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-4 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 bg-white"
                    checked={selectedIds.size === leads.length && leads.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Client Details</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Source & Property</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Assignee</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Last Activity</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map((lead: any) => (
                <tr 
                  key={lead.id} 
                  onClick={() => setSelectedLead(lead)}
                  className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${selectedIds.has(lead.id) ? 'bg-blue-50/30' : ''}`}
                >
                  <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 bg-white"
                      checked={selectedIds.has(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center text-primary font-black text-sm">
                         {lead.name?.charAt(0) || "L"}
                       </div>
                       <div>
                         <p className="text-sm font-black text-slate-800">{lead.name || lead.phone}</p>
                         <p className="text-[11px] text-slate-400 flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><MessageSquare className="h-3.5 w-3.5" /></span>
                      <p className="text-xs font-bold text-slate-600 uppercase">{lead.source || 'WHATSAPP'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {(() => {
                      const colors: any = {
                        NEW: "bg-blue-50 text-blue-600 border-blue-100",
                        CONNECTED: "bg-emerald-50 text-emerald-600 border-emerald-100",
                        NOT_CONNECTED: "bg-orange-50 text-orange-600 border-orange-100",
                        QUALIFIED: "bg-purple-50 text-purple-600 border-purple-100",
                        NOT_QUALIFIED: "bg-slate-100 text-slate-400 border-slate-200",
                        SITE_VISIT: "bg-amber-50 text-amber-600 border-amber-100",
                        CONVERTED: "bg-indigo-50 text-indigo-600 border-indigo-100",
                        LOST: "bg-red-50 text-red-600 border-red-100"
                      }
                      return (
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${colors[lead.status] || "bg-slate-100"}`}>
                          {lead.status}
                        </span>
                      )
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                         {lead.assignedTo?.name?.charAt(0) || "U"}
                       </div>
                       <p className="text-xs font-bold text-slate-600">{lead.assignedTo?.name || "Unassigned"}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[11px] font-medium text-slate-500">{new Date(lead.updatedAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}</p>
                    <p className="text-[10px] text-slate-400">{lead.budget ? `Budget: ${lead.budget}` : 'Interested'}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                       <button 
                         onClick={() => {
                           setEditingLead(lead)
                           setFormData({ name: lead.name, phone: lead.phone, email: lead.email || "", budget: lead.budget || "", location: lead.location || "" })
                           setIsEditModalOpen(true)
                         }}
                         className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors"
                       >
                         <Edit3 className="h-4 w-4" />
                       </button>
                       <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><MessageSquare className="h-4 w-4" /></button>
                       <button 
                         onClick={() => deleteLead(lead.id)}
                         className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
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
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Users className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-lg font-black text-slate-800">No clients found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Once you connect your WhatsApp, new client inquiries will appear here automatically.</p>
          </div>
        )}
        
        {/* Pagination Controls */}
        {meta.pages > 1 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Page {page} of {meta.pages}</p>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black disabled:opacity-50 hover:bg-slate-50 transition-all"
              >Previous</button>
              <button 
                disabled={page === meta.pages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black disabled:opacity-50 hover:bg-slate-50 transition-all"
              >Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Drawer */}
      <div className={`fixed inset-y-0 right-0 z-[100] w-80 bg-white shadow-2xl border-l border-slate-100 transform transition-transform duration-300 ease-in-out ${isFilterOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black text-slate-800">Filters</h2>
            <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg"><X className="h-5 w-5 text-slate-400" /></button>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Client Status</p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { setStatusFilter("ALL"); setIsFilterOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl text-xs font-bold text-left transition-all ${statusFilter === 'ALL' ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600 border border-slate-100'}`}
                >ALL CLIENTS</button>
                {['NEW', 'CONNECTED', 'NOT_CONNECTED', 'QUALIFIED', 'NOT_QUALIFIED', 'SITE_VISIT', 'CONVERTED'].map(s => (
                  <button 
                    key={s}
                    onClick={() => { setStatusFilter(s); setIsFilterOpen(false); }}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-bold text-left transition-all ${statusFilter === s ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-slate-50 text-slate-600 border border-slate-100'}`}
                  >{s.replace('_', ' ')}</button>
                ))}
              </div>
            </div>
          </div>
          <button 
            onClick={() => { setStatusFilter("ALL"); setIsFilterOpen(false); }}
            className="mt-auto w-full py-3 text-xs font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
          >Reset Filters</button>
        </div>
      </div>

      {/* Detail Drawer */}
      <div className={`fixed inset-y-0 right-0 z-[100] w-[450px] bg-white shadow-2xl border-l border-slate-100 transform transition-transform duration-300 ease-in-out ${selectedLead ? "translate-x-0" : "translate-x-full"}`}>
        {selectedLead && (
          <div className="p-8 h-full flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-800">Client Insights</h2>
              <button onClick={() => { setSelectedLead(null); setDrawerError(null); }} className="p-2 hover:bg-slate-50 rounded-lg"><X className="h-5 w-5 text-slate-400" /></button>
            </div>

            {drawerError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
                <BadgeInfo className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-red-700 uppercase leading-none">Update Failed</p>
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{drawerError}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black text-2xl border border-primary/10 shadow-inner">
                {selectedLead.name?.charAt(0) || "L"}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 leading-tight">{selectedLead.name || selectedLead.phone}</h3>
                <p className="text-sm font-bold text-slate-400 mt-1 flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedLead.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Activity className="h-3 w-3" /> Status</p>
                <p className="text-xs font-black text-primary uppercase">{selectedLead.status}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Source</p>
                <p className="text-xs font-black text-slate-600 uppercase">{selectedLead.source || 'WHATSAPP'}</p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Update Pipeline Stage</p>
              <div className="flex flex-wrap gap-2">
                {['NEW', 'CONNECTED', 'NOT_CONNECTED', 'QUALIFIED', 'NOT_QUALIFIED', 'SITE_VISIT', 'CONVERTED', 'LOST'].map(s => (
                  <button 
                    key={s}
                    disabled={!!updatingStatus}
                    onClick={() => updateLeadStatus(selectedLead.id, s)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all flex items-center gap-1 ${
                      selectedLead.status === s 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'
                    } ${updatingStatus === s ? 'opacity-50' : ''}`}
                  >
                    {s.replace('_', ' ')}
                    {updatingStatus === s && <Clock className="h-2.5 w-2.5 animate-spin" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-tighter"><Activity className="h-4 w-4 text-primary" /> Interaction History</h4>
                <form onSubmit={handleLogActivity} className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex gap-2 mb-3">
                    {['CALL', 'MESSAGE', 'MEETING', 'NOTE'].map(t => (
                      <button 
                        key={t} type="button"
                        onClick={() => setActivityForm({...activityForm, type: t})}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-tight transition-all ${activityForm.type === t ? 'bg-slate-800 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder={`Describe the ${activityForm.type.toLowerCase()}...`}
                      className="flex-1 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[11px] focus:ring-1 focus:ring-primary outline-none"
                      value={activityForm.content}
                      onChange={e => setActivityForm({...activityForm, content: e.target.value})}
                    />
                    <button 
                      type="submit" 
                      disabled={loggingActivity}
                      className="p-2 bg-primary text-white rounded-xl shadow-md disabled:opacity-50 transition-all"
                    >
                      {loggingActivity ? <Clock className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    </button>
                  </div>
                </form>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {activityLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-12 bg-slate-50 rounded-xl" />
                      <div className="h-12 bg-slate-50 rounded-xl" />
                    </div>
                  ) : activities.length === 0 ? (
                    <p className="text-[10px] text-slate-400 text-center py-4">No activity logged yet.</p>
                  ) : (
                    activities.map((act: any) => (
                      <div key={act.id} className="relative pl-6 border-l-2 border-slate-50 pb-4 last:pb-0">
                        <div className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${act.type === 'CALL' ? 'bg-blue-400' : act.type === 'MEETING' ? 'bg-amber-400' : 'bg-slate-300'}`} />
                        <div className="bg-white border border-slate-50 rounded-xl p-3 shadow-sm">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[9px] font-black text-slate-800 uppercase leading-none">{act.type}</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase">{new Date(act.createdAt).toLocaleDateString("en-IN", { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">{act.content}</p>
                          <p className="text-[8px] font-bold text-primary mt-1 uppercase tracking-widest">By: {act.user?.name || "Agent"}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-800 mb-2 flex items-center gap-2 uppercase tracking-tighter"><BadgeInfo className="h-4 w-4 text-primary" /> Profile Notes</h4>
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-xs text-slate-600 leading-relaxed min-h-[100px]">
                  {selectedLead.notes || "This client was automatically synced from WhatsApp. No manual notes have been added yet."}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-800 mb-2 flex items-center gap-2 uppercase tracking-tighter"><ArrowUpRight className="h-4 w-4 text-emerald-500" /> Property Intent</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-emerald-100 transition-colors">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> Property Type</span>
                    <span className="text-[11px] font-black">{selectedLead.propertyType || "Residential"}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-100 transition-colors">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Budget Range</span>
                    <span className="text-[11px] font-black text-indigo-600">{selectedLead.budget || "Not Specified"}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-amber-100 transition-colors">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Preferred Location</span>
                    <span className="text-[11px] font-black">{selectedLead.location || "Not Specified"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8 flex gap-3">
              <Link href="/dashboard/chat" className="flex-1 py-4 bg-primary text-white rounded-2xl text-sm font-black shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
                <MessageSquare className="h-5 w-5" /> Open WhatsApp Chat
              </Link>
            </div>
          </div>
        )}
      </div>

      {(isFilterOpen || selectedLead) && (
        <div onClick={() => { setIsFilterOpen(false); setSelectedLead(null); }} className="fixed inset-0 z-[90] bg-slate-900/40 backdrop-blur-[3px] animate-in fade-in duration-300" />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl border border-slate-100 transform animate-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900">Add New Client</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Full Name" required className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="text" placeholder="Phone Number" required className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <input type="email" placeholder="Email Address" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <div className="flex gap-4">
                <input type="text" placeholder="Budget" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
                <input type="text" placeholder="Location" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all mt-4">Save Client & Start Tracking</button>
            </form>
          </div>
        </div>
      )}

      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] p-8 w-full max-w-2xl shadow-2xl border border-slate-100 transform animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-black text-slate-900">Bulk Client Upload</h2>
              <button onClick={() => setIsBulkModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X className="h-6 w-6" /></button>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Excel / CSV / Manual Paste</p>
              <button onClick={downloadSample} className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase">
                <FileDown className="h-3 w-3" /> Download Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl p-8 hover:bg-slate-50 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-black text-slate-800">Upload Excel/CSV</p>
                  <p className="text-[10px] text-slate-400 mt-1">Drag & drop or Click to browse</p>
                  <input type="file" accept=".xlsx, .xls, .csv" className="hidden" onChange={handleFileUpload} />
               </label>

               <div className="flex flex-col justify-center p-6 bg-slate-50/50 rounded-3xl border border-slate-50 text-center">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FileType className="h-5 w-5" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-2">Manual Format</p>
                  <p className="text-[9px] text-slate-400">Name, Phone, Email, Budget, Location (One per line)</p>
               </div>
            </div>

            <form onSubmit={handleBulkUpload} className="space-y-4">
              <textarea 
                placeholder="Or paste data: John Doe, 9876543210, john@example.com, ₹50L, Noida"
                className="w-full h-48 px-5 py-4 rounded-3xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none text-xs font-mono leading-relaxed"
                value={bulkData}
                onChange={e => setBulkData(e.target.value)}
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setBulkData("")} className="flex-1 py-4 border border-slate-200 text-slate-400 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all">
                  Clear Data
                </button>
                <button type="submit" className="flex-[2] py-4 bg-slate-800 text-white rounded-2xl font-black shadow-lg hover:bg-slate-900 active:scale-95 transition-all">
                  Start Bulk Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[120] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-8 animate-in slide-in-from-bottom-10">
          <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Selected</span>
             <span className="text-xl font-black">{selectedIds.size} Clients</span>
          </div>
          
          <div className="h-10 w-[1px] bg-white/10" />
          
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsBroadcastModalOpen(true)}
               className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-black hover:scale-105 transition-all active:scale-95 shadow-lg shadow-primary/20"
             >
               <MessageSquare className="h-4 w-4" /> Broadcast
             </button>
             <button 
               onClick={handleBulkDelete}
               disabled={isBulkDeleting}
               className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
             >
               {isBulkDeleting ? <Clock className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete
             </button>
             <button 
               onClick={() => setSelectedIds(new Set())}
               className="text-slate-400 hover:text-white text-xs font-bold px-3 transition-colors"
             >
               Cancel
             </button>
          </div>
        </div>
      )}

      {/* WhatsApp Broadcast Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-lg shadow-2xl border border-slate-100 transform animate-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900">WhatsApp Broadcast</h2>
                <p className="text-sm text-slate-500 mt-1">Sending to {selectedIds.size} selected clients</p>
              </div>
              <button onClick={() => setIsBroadcastModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X className="h-7 w-7" /></button>
            </div>
            
            <div className="space-y-6">
              <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50 flex items-start gap-4">
                 <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><BadgeInfo className="h-5 w-5" /></div>
                 <p className="text-xs text-blue-700 leading-relaxed font-black uppercase tracking-tighter">
                   Avoid sending promotional links as your first message to prevent WhatsApp flagging. Keep it conversational!
                 </p>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Message Content</label>
                <textarea 
                  placeholder="Hi! This is from PropCRM. We have a new project update for you..."
                  className="w-full h-40 px-6 py-5 rounded-3xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm leading-relaxed"
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                />
              </div>

              <button 
                onClick={handleBroadcast}
                disabled={isBroadcasting || !broadcastMessage.trim()}
                className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isBroadcasting ? <Clock className="h-5 w-5 animate-spin" /> : <MessageSquare className="h-5 w-5" />}
                {isBroadcasting ? "Sending Broadcast..." : "Send to All Clients"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
