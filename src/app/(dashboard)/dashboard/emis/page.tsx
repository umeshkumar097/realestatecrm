"use client"
import { useState, useEffect } from "react"
import { 
  CreditCard, Calendar, User, 
  MapPin, Plus, Loader2, ArrowRight,
  TrendingUp, Clock, AlertTriangle, Building2,
  Filter, Search, Edit3, Trash2, X, ShieldCheck
} from "lucide-react"

export default function EMIPage() {
  const [emis, setEmis] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [totalDueSoon, setTotalDueSoon] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentEmiId, setCurrentEmiId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    leadId: "",
    projectId: "",
    plotNumber: "",
    plotRate: "",
    totalPrice: "",
    planDetails: "",
    startDate: "",
    frequency: "MONTHLY",
    totalInstallments: "12",
    installmentAmount: "",
    status: "ACTIVE"
  })

  // Auto-calculate Total Price if Amount/Count changes
  useEffect(() => {
    const amt = parseFloat(formData.installmentAmount)
    const count = parseInt(formData.totalInstallments)
    if (!isNaN(amt) && !isNaN(count)) {
        setFormData(prev => ({...prev, totalPrice: (amt * count).toString()}))
    }
  }, [formData.installmentAmount, formData.totalInstallments])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [resEmis, resProjects, resLeads] = await Promise.all([
        fetch("/api/emis"),
        fetch("/api/projects"),
        fetch("/api/leads")
      ])

      const emiData = await resEmis.json()
      const projectsData = await resProjects.json()
      const leadsData = await resLeads.json()

      setEmis(emiData.emis || [])
      setTotalDueSoon(emiData.dueSoon || 0)
      setProjects(Array.isArray(projectsData) ? projectsData : [])
      setLeads(Array.isArray(leadsData.leads) ? leadsData.leads : [])
    } catch (err: any) {
      console.error("[EMI Load Error]:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = isEditing ? `/api/emis/${currentEmiId}` : "/api/emis"
      const method = isEditing ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        setIsModalOpen(false)
        resetForm()
        loadData()
      } else {
        const errData = await res.json().catch(() => ({ error: `Failed to ${isEditing ? 'update' : 'create'} EMI` }))
        alert(errData.details || errData.error || "Operation failed")
      }
    } catch (err: any) {
      console.error("[EMI Save Error]:", err)
      alert("Network error. Please try again.")
    }
  }

  const handleForeclose = async (id: string) => {
    if (!confirm("Are you sure you want to Foreclose this plan? This will mark all remaining installments as PAID and end the plan schedule.")) return
    try {
      const res = await fetch(`/api/emis/${id}`, { 
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "FORECLOSED" })
      })
      if (res.ok) {
          loadData()
      } else {
          const errData = await res.json()
          alert(errData.error || "Foreclosure failed")
      }
    } catch (err) {
        alert("Foreclosure failed due to network error")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this EMI plan? This will also remove all scheduled installments permanently.")) return
    try {
      const res = await fetch(`/api/emis/${id}`, { method: "DELETE" })
      if (res.ok) {
          loadData()
      } else {
          const errData = await res.json()
          alert(errData.error || "Delete failed")
      }
    } catch (err) {
        alert("Delete failed due to network error")
    }
  }

  const handleEdit = (emi: any) => {
    setFormData({
        leadId: emi.leadId,
        projectId: emi.projectId,
        plotNumber: emi.plotNumber,
        plotRate: emi.plotRate.toString(),
        totalPrice: emi.totalPrice.toString(),
        planDetails: emi.planDetails || "",
        startDate: new Date(emi.startDate).toISOString().split('T')[0],
        frequency: emi.frequency,
        totalInstallments: emi.totalInstallments.toString(),
        installmentAmount: emi.installmentAmount.toString(),
        status: emi.status
    })
    setCurrentEmiId(emi.id)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      leadId: "", projectId: "", plotNumber: "", plotRate: "",
      totalPrice: "", planDetails: "", startDate: "", 
      frequency: "MONTHLY", totalInstallments: "12", installmentAmount: "",
      status: "ACTIVE"
    })
    setIsEditing(false)
    setCurrentEmiId(null)
  }

  const [activeTab, setActiveTab] = useState<"ACTIVE" | "UPCOMING">("ACTIVE")

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4 italic font-black">
            <div className="p-3 bg-emerald-600/10 rounded-[20px] shadow-sm">
                <CreditCard className="h-8 w-8 text-emerald-600" />
            </div>
            Fiscal Asset Governance
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] ml-20 italic">Overseeing {emis.length} active fiscal nodes within the global ledger matrix</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true) }}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all group"
        >
          <Plus className="h-4 w-4 text-emerald-400" /> Establish Fiscal Node
        </button>
      </div>

      <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-1.5 rounded-full w-fit border border-slate-100 shadow-sm">
          <button 
              onClick={() => setActiveTab("ACTIVE")}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all italic ${activeTab === "ACTIVE" ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900"}`}
          >
              Active Node Registry
          </button>
          <button 
              onClick={() => setActiveTab("UPCOMING")}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all italic ${activeTab === "UPCOMING" ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900"}`}
          >
              Critical Due Clusters ({totalDueSoon})
          </button>
      </div>

      {activeTab === "ACTIVE" ? (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-[24px]"><TrendingUp className="h-7 w-7" /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1 italic">Active Fiscal Nodes</p>
                  <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{emis.length}</p>
                </div>
              </div>
              <div className="mt-5 w-12 h-1 bg-blue-600 rounded-full" />
            </div>
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-[24px]"><CreditCard className="h-7 w-7" /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1 italic">Projected Portfolio Yield</p>
                  <p className="text-3xl font-black text-slate-900 italic tracking-tighter">₹{emis.reduce((acc: number, curr: any) => acc + curr.totalPrice, 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-5 w-12 h-1 bg-emerald-500 rounded-full" />
            </div>
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-amber-50 text-amber-600 rounded-[24px]"><Clock className="h-7 w-7" /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1 italic">Imminent Ingress (Due)</p>
                  <p className="text-3xl font-black text-amber-600 italic tracking-tighter">{totalDueSoon}</p>
                </div>
              </div>
              <div className="mt-5 w-12 h-1 bg-amber-500 rounded-full" />
            </div>
          </div>

          {/* EMI Table */}
          <div className="bg-white border border-slate-100 rounded-[48px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full border border-slate-100 flex-1 max-w-md shadow-sm group">
                <Search className="h-4 w-4 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                <input type="text" placeholder="Search master ledger by client or plot node..." className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-300 placeholder:italic" />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:bg-slate-900 hover:text-white transition-all italic">
                <Filter className="h-4 w-4" /> Filter Matrix
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Client & Asset Node</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Architectural Cluster</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Amortization Matrix</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Governance Status</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {emis.map((emi) => (
                    <tr key={emi.id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-10 py-6">
                        <p className="text-sm font-black text-slate-900 italic tracking-tight">{emi.lead.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 italic">Plot Ingress #{emi.plotNumber}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2.5">
                            <Building2 className="h-4 w-4 text-emerald-600" />
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] italic">{emi.project.name}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-slate-900 italic">₹{emi.installmentAmount.toLocaleString()}/mo</p>
                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] mt-1 italic">{emi.totalInstallments} Nodes ({emi.frequency})</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-2 rounded-full text-[9px] font-black tracking-[0.3em] uppercase italic shadow-sm border ${emi.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/10' : 'bg-slate-50 text-slate-600 border-slate-100 shadow-slate-900/10'}`}>{emi.status}</span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleForeclose(emi.id)} title="Authorize Foreclosure" className="p-3 bg-white shadow-xl rounded-[16px] text-emerald-400 hover:text-emerald-600 border border-slate-100 transition-all hover:scale-110 active:scale-90"><ShieldCheck className="h-4 w-4" /></button>
                            <button onClick={() => handleEdit(emi)} className="p-3 bg-white shadow-xl rounded-[16px] text-slate-400 hover:text-blue-600 border border-slate-100 transition-all hover:scale-110 active:scale-90"><Edit3 className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(emi.id)} className="p-3 bg-white shadow-xl rounded-[16px] text-slate-400 hover:text-rose-600 border border-slate-100 transition-all hover:scale-110 active:scale-90"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {emis.length === 0 && (
                <div className="p-20 text-center bg-white">
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 italic">No fiscal nodes detected in the master ledger.</p>
                </div>
            )}
          </div>
        </div>
      ) : (
        /* Upcoming Dues View */
        <div className="bg-white border border-slate-100 rounded-[60px] p-16 overflow-hidden relative min-h-[500px] animate-in slide-in-from-right-4 duration-700 shadow-sm hover:shadow-2xl transition-all duration-500">
           <div className="flex items-center justify-between mb-16 relative z-10">
               <div className="space-y-2">
                   <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic font-black">Critical Ingress Clusters</h2>
                   <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] italic">Awaiting financial realization across the 7-day governance window.</p>
               </div>
               <div className="p-5 bg-amber-500/10 rounded-[32px] animate-pulse">
                <AlertTriangle className="text-amber-500" size={48} />
               </div>
           </div>

           <div className="space-y-6 relative z-10">
               {emis.filter(e => e.status === "ACTIVE").map(emi => (
                   <div key={emi.id} className="flex flex-col lg:flex-row items-center justify-between p-10 bg-slate-50/50 border border-slate-50 rounded-[40px] group hover:border-amber-200 hover:bg-amber-50/30 transition-all duration-500 shadow-inner hover:shadow-lg">
                       <div className="flex items-center gap-10">
                           <div className="w-20 h-20 bg-white border border-slate-100 rounded-[28px] flex items-center justify-center font-black text-slate-900 text-2xl italic shadow-xl group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-amber-900/5">
                               {new Date(emi.startDate).getDate()}
                           </div>
                           <div className="space-y-2">
                               <p className="text-2xl font-black text-slate-900 italic tracking-tight leading-none">{emi.lead.name}</p>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 italic pt-1">
                                  <Building2 size={12} className="text-emerald-500"/> {emi.project.name} <span className="opacity-30">|</span> Asset Node #{emi.plotNumber}
                               </p>
                           </div>
                       </div>
                       <div className="flex items-center gap-12 mt-8 lg:mt-0">
                           <div className="text-right">
                               <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] mb-2 italic">Realization Target</p>
                               <p className="text-2xl font-black text-emerald-600 italic tracking-tighter">₹{emi.installmentAmount.toLocaleString()}</p>
                           </div>
                           <button className="px-10 py-4 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/10 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all italic">
                               Authorize Alert
                           </button>
                       </div>
                   </div>
               ))}
               {emis.length === 0 && (
                   <div className="py-24 text-center space-y-6">
                       <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto opacity-20">
                        <CreditCard size={48}/>
                       </div>
                       <p className="text-[11px] font-black uppercase text-slate-300 tracking-[0.3em] italic">Global ledger matrix currently reporting zero critical due nodes.</p>
                   </div>
               )}
           </div>

           {/* Backdrop Decorative */}
           <div className="absolute -bottom-20 -right-20 p-24 opacity-[0.03] select-none pointer-events-none grayscale">
               <CreditCard size={400} />
           </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-6">
          <div className="bg-white rounded-[60px] p-12 w-full max-w-xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 border border-slate-100 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">{isEditing ? 'Modify Fiscal Node' : 'Initialize Fiscal Node'}</h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1 italic">Amortization Protocol Authorization Required</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-slate-50 rounded-full transition-all text-slate-400"><X className="h-8 w-8" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Target Client Node</label>
                  <select required disabled={isEditing} className="w-full px-6 py-5 rounded-[28px] border border-slate-50 mt-1 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all appearance-none cursor-pointer disabled:opacity-50" value={formData.leadId} onChange={e => setFormData({...formData, leadId: e.target.value})}>
                    <option value="">Select Cluster Member</option>
                    {leads.map(l => <option key={l.id} value={l.id}>{l.name} ({l.phone})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Architectural Cluster</label>
                  {projects.length > 0 ? (
                    <select required disabled={isEditing} className="w-full px-6 py-5 rounded-[28px] border border-slate-50 mt-1 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all appearance-none cursor-pointer disabled:opacity-50" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                      <option value="">Select Project Site</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  ) : (
                    <div className="mt-1 p-5 bg-amber-500/5 border border-amber-500/10 rounded-[24px]">
                        <p className="text-[9px] font-black uppercase text-amber-600 leading-tight italic font-black">Zero Project Sites Detected.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Asset Identifying Node (Plot #)</label>
                   <input type="text" placeholder="e.g. Unit 202-B" required className="w-full px-6 py-5 rounded-[28px] border border-slate-50 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all" value={formData.plotNumber} onChange={e => setFormData({...formData, plotNumber: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Regional Plot Rate</label>
                   <input type="number" placeholder="5500" required className="w-full px-6 py-5 rounded-[28px] border border-slate-50 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all" value={formData.plotRate} onChange={e => setFormData({...formData, plotRate: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Amortization Frequency</label>
                    <select required disabled={isEditing} className="w-full px-6 py-5 rounded-[28px] border border-slate-50 mt-1 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all appearance-none cursor-pointer disabled:opacity-50" value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})}>
                        <option value="MONTHLY">Monthly Nodes</option>
                        <option value="QUARTERLY">Quarterly Nodes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Total Installment Yield</label>
                    <input type="number" required disabled={isEditing} className="w-full px-6 py-5 rounded-[28px] border border-slate-50 mt-1 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all disabled:opacity-50" value={formData.totalInstallments} onChange={e => setFormData({...formData, totalInstallments: e.target.value})} />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Fiscal Realization Amount (₹)</label>
                  <input type="number" placeholder="₹ Per Installment" required disabled={isEditing} className="w-full px-6 py-5 rounded-[28px] border border-slate-50 mt-1 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all disabled:opacity-50 text-emerald-600" value={formData.installmentAmount} onChange={e => setFormData({...formData, installmentAmount: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Current Lifecycle Status</label>
                  <select className="w-full px-6 py-5 rounded-[28px] border border-slate-50 mt-1 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all appearance-none cursor-pointer text-blue-600" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="ACTIVE">ACTIVE Governance</option>
                      <option value="CANCELLED">CANCELLED/Void</option>
                      <option value="FORECLOSED">FORECLOSED (Early Resolve)</option>
                  </select>
                </div>
              </div>

              {!isEditing && (
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Fiscal Ingress Genesis Date</label>
                    <input type="date" required className="w-full px-8 py-5 rounded-[32px] border border-slate-50 mt-1 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Amortization Particulars</label>
                <textarea placeholder="Outline fiscal particulars (interest rates, bank ledger mapping, developer notes)..." className="w-full px-8 py-6 rounded-[32px] border border-slate-50 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all leading-relaxed" rows={3} value={formData.planDetails} onChange={e => setFormData({...formData, planDetails: e.target.value})} />
              </div>
              
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-6 border border-slate-100 rounded-[32px] text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic hover:text-slate-900 transition-all font-black active:scale-95">Abort Plan</button>
                <button type="submit" className="flex-[2] px-10 py-6 bg-slate-900 text-white rounded-[32px] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 transition-all italic font-black">
                    {isEditing ? 'Authorizing Ledger Update' : 'Initialize Fiscal Genesis ⚡'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
