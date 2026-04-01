"use client"
import { useState, useEffect } from "react"
import { 
  CreditCard, Calendar, User, 
  MapPin, Plus, Loader2, ArrowRight,
  TrendingUp, Clock, AlertTriangle, Building2,
  Filter, Search
} from "lucide-react"

export default function EMIPage() {
  const [emis, setEmis] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [totalDueSoon, setTotalDueSoon] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
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
    installmentAmount: ""
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

  const handleCreateEMI = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/emis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setIsModalOpen(false)
        setFormData({
          leadId: "", projectId: "", plotNumber: "", plotRate: "",
          totalPrice: "", planDetails: "", startDate: "", 
          frequency: "MONTHLY", totalInstallments: "12", installmentAmount: ""
        })
        loadData()
      } else {
        const errData = await res.json().catch(() => ({ error: "Failed to create EMI" }))
        alert(errData.error || "Failed to create EMI")
      }
    } catch (err: any) {
      console.error("[EMI Create Error]:", err)
      alert("Error adding EMI plan")
    }
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
          onClick={() => setIsModalOpen(true)}
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
                    <tr key={emi.id} className="hover:bg-slate-50/80 transition-all font-bold">
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
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100 tracking-widest uppercase font-black shadow-sm shadow-emerald-600/5">{emi.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><ArrowRight className="h-4 w-4 text-slate-400" /></button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-black text-slate-900 mb-6">Create New EMI Plan</h2>
            <form onSubmit={handleCreateEMI} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Client</label>
                  <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1 bg-white text-sm" value={formData.leadId} onChange={e => setFormData({...formData, leadId: e.target.value})}>
                    <option value="">Select Client</option>
                    {leads.map(l => <option key={l.id} value={l.id}>{l.name} ({l.phone})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Project</label>
                  {projects.length > 0 ? (
                    <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1 bg-white text-sm font-bold" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                      <option value="">Select Project</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  ) : (
                    <div className="mt-1 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-[9px] font-black uppercase text-amber-600 leading-tight">No Projects Found. Create one in 'Projects' tab first.</p>
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
                    <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1 bg-white text-sm font-bold" value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})}>
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUARTERLY">Quarterly</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Total Installments</label>
                    <input type="number" required className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1 font-bold" value={formData.totalInstallments} onChange={e => setFormData({...formData, totalInstallments: e.target.value})} />
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">EMI Amount (₹)</label>
                  <input type="number" placeholder="₹ Per Installment" required className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1 font-bold text-emerald-600" value={formData.installmentAmount} onChange={e => setFormData({...formData, installmentAmount: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Total Price (Auto)</label>
                  <input type="number" readOnly className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1 bg-slate-50 font-black" value={formData.totalPrice} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Start Date (First Payment)</label>
                <input type="date" required className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1 font-bold" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              </div>

              <textarea placeholder="Plan Details (Interest, bank account, etc.)" className="w-full px-4 py-3 rounded-xl border border-slate-200 font-medium" value={formData.planDetails} onChange={e => setFormData({...formData, planDetails: e.target.value})} />
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500">Cancel</button>
                <button type="submit" className="flex-2 px-8 py-3 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Active EMI Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
