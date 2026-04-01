"use client"
import { useState, useEffect } from "react"
import { 
  CreditCard, Calendar, User, 
  MapPin, Plus, Loader2, ArrowRight,
  TrendingUp, Clock, AlertTriangle, Building2,
  Filter, Search, Edit3, Trash2, X
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
        alert(errData.error || "Operation failed")
      }
    } catch (err: any) {
      console.error("[EMI Save Error]:", err)
      alert("Network error. Please try again.")
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">EMI Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track installments, plot rates, and proactive payment schedules.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true) }}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" /> New Plan Activation
        </button>
      </div>

      <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-2xl w-fit border border-zinc-200">
          <button 
              onClick={() => setActiveTab("ACTIVE")}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "ACTIVE" ? "bg-white text-primary shadow-sm" : "text-zinc-500"}`}
          >
              Active Plans
          </button>
          <button 
              onClick={() => setActiveTab("UPCOMING")}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "UPCOMING" ? "bg-white text-primary shadow-sm" : "text-zinc-500"}`}
          >
              Upcoming Dues ({totalDueSoon})
          </button>
      </div>

      {activeTab === "ACTIVE" ? (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><TrendingUp className="h-6 w-6" /></div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Plans</p>
                  <p className="text-2xl font-black text-slate-800">{emis.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CreditCard className="h-6 w-6" /></div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Platform Revenue</p>
                  <p className="text-2xl font-black text-slate-800">₹{emis.reduce((acc: number, curr: any) => acc + curr.totalPrice, 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Clock className="h-6 w-6" /></div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Due Soon</p>
                  <p className="text-2xl font-black text-slate-800">{totalDueSoon}</p>
                </div>
              </div>
            </div>
          </div>

          {/* EMI Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 flex-1 max-w-md">
                <Search className="h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Search by client or plot..." className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Client & Plot</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Project</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">EMI Plan</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Financial Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {emis.map((emi) => (
                    <tr key={emi.id} className="hover:bg-slate-50/80 transition-all font-bold group">
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-800">{emi.lead.name}</p>
                        <p className="text-[11px] text-zinc-400 font-medium tracking-tight">Plot #{emi.plotNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 uppercase font-black tracking-widest"><Building2 className="h-3.5 w-3.5" /> {emi.project.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-800">₹{emi.installmentAmount.toLocaleString()}/mo</p>
                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">{emi.totalInstallments} Months ({emi.frequency})</p>
                      </td>
                      <td className="px-6 py-4 text-[10px]">
                        <span className={`px-3 py-1.5 rounded-full border tracking-widest uppercase font-black shadow-sm ${emi.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-600/5' : 'bg-red-50 text-red-600 border-red-100 shadow-red-600/5'}`}>{emi.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEdit(emi)} className="p-2 hover:bg-primary/10 rounded-lg transition-colors"><Edit3 className="h-4 w-4 text-slate-400 hover:text-primary" /></button>
                            <button onClick={() => handleDelete(emi.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" /></button>
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors group-hover:bg-white border-none"><ArrowRight className="h-4 w-4 text-slate-400" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Upcoming Dues View */
        <div className="bg-white border border-slate-200 rounded-[48px] p-12 overflow-hidden relative min-h-[400px] animate-in slide-in-from-right-4 duration-500">
           <div className="flex items-center justify-between mb-12">
               <div className="space-y-2">
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Upcoming Dues Registry</h2>
                   <p className="text-zinc-500 font-medium">Critical financial visibility for the next 7 days across all agency plans.</p>
               </div>
               <AlertTriangle className="text-amber-500 animate-pulse" size={40} />
           </div>

           <div className="space-y-4">
               {emis.filter(e => e.status === "ACTIVE").map(emi => (
                   <div key={emi.id} className="flex flex-col md:flex-row items-center justify-between p-8 bg-zinc-50 border border-zinc-100 rounded-3xl group hover:border-amber-200 hover:bg-amber-50/50 transition-all">
                       <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center font-black text-primary shadow-sm group-hover:scale-105 transition-all">
                               {new Date(emi.startDate).getDate()}
                           </div>
                           <div className="space-y-1">
                               <p className="text-lg font-black text-slate-900 tracking-tight">{emi.lead.name}</p>
                               <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                  <Building2 size={12}/> {emi.project.name} • Plot #{emi.plotNumber}
                               </p>
                           </div>
                       </div>
                       <div className="flex items-center gap-8 mt-6 md:mt-0">
                           <div className="text-right">
                               <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1">Expected Amount</p>
                               <p className="text-xl font-black text-emerald-600">₹{emi.installmentAmount.toLocaleString()}</p>
                           </div>
                           <button className="px-6 py-3 bg-white border border-zinc-200 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-900 hover:text-white transition-all shadow-sm">
                               Alert Agent
                           </button>
                       </div>
                   </div>
               ))}
               {emis.length === 0 && (
                   <div className="py-20 text-center space-y-4">
                       <CreditCard className="mx-auto text-zinc-200" size={64}/>
                       <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">No pending installments recorded for this window.</p>
                   </div>
               )}
           </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 border border-slate-100 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900">{isEditing ? 'Modify EMI Plan' : 'Create New EMI Plan'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Client</label>
                  <select required disabled={isEditing} className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1 bg-white text-sm disabled:opacity-50" value={formData.leadId} onChange={e => setFormData({...formData, leadId: e.target.value})}>
                    <option value="">Select Client</option>
                    {leads.map(l => <option key={l.id} value={l.id}>{l.name} ({l.phone})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Project</label>
                  {projects.length > 0 ? (
                    <select required disabled={isEditing} className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1 bg-white text-sm font-bold disabled:opacity-50" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                      <option value="">Select Project</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  ) : (
                    <div className="mt-1 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-[9px] font-black uppercase text-amber-600 leading-tight">No Projects Found.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Plot Number" required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={formData.plotNumber} onChange={e => setFormData({...formData, plotNumber: e.target.value})} />
                <input type="number" placeholder="Plot Rate" required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={formData.plotRate} onChange={e => setFormData({...formData, plotRate: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Frequency</label>
                    <select required disabled={isEditing} className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1 bg-white text-sm font-bold disabled:opacity-50" value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})}>
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUARTERLY">Quarterly</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Installments Count</label>
                    <input type="number" required disabled={isEditing} className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1 font-bold disabled:opacity-50" value={formData.totalInstallments} onChange={e => setFormData({...formData, totalInstallments: e.target.value})} />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">EMI Amount (₹)</label>
                  <input type="number" placeholder="₹ Per Installment" required disabled={isEditing} className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1 font-bold text-emerald-600 disabled:opacity-50 text-[11px]" value={formData.installmentAmount} onChange={e => setFormData({...formData, installmentAmount: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Plan Status</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1 bg-white text-sm font-black text-primary" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              {!isEditing && (
                <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Start Date (First Payment)</label>
                    <input type="date" required className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1 font-bold" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
              )}

              <textarea placeholder="Plan Details (Interest, bank account, etc.)" className="w-full px-4 py-3 rounded-xl border border-slate-200 font-medium text-sm" rows={3} value={formData.planDetails} onChange={e => setFormData({...formData, planDetails: e.target.value})} />
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-300 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]">Discard</button>
                <button type="submit" className="flex-[2] px-8 py-3 bg-primary text-white rounded-xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-[10px]">
                    {isEditing ? 'Save Changes' : 'Active EMI Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
