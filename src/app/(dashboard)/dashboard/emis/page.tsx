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
    expiryDate: ""
  })

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

      if (!resEmis.ok || !resProjects.ok || !resLeads.ok) {
        throw new Error("One or more APIs failed to respond correctly")
      }

      const emiData = await resEmis.json()
      const projectsData = await resProjects.json()
      const leadsData = await resLeads.json()

      setEmis(emiData.emis || [])
      setTotalDueSoon(emiData.dueSoon || 0)
      setProjects(Array.isArray(projectsData) ? projectsData : [])
      setLeads(Array.isArray(leadsData.leads) ? leadsData.leads : [])
    } catch (err: any) {
      console.error("[EMI Load Error]:", err)
      setEmis([])
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
          totalPrice: "", planDetails: "", startDate: "", expiryDate: ""
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">EMI Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Track installments, plot rates, and payment schedules.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" /> New EMI Plan
        </button>
      </div>

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
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
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
            <input type="text" placeholder="Search by client or plot..." className="w-full bg-transparent border-none focus:ring-0 text-sm" />
          </div>
          <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50"><Filter className="h-4 w-4 text-slate-500" /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Client & Plot</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Project</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Rate & Total</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Start/Expiry</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {emis.map((emi) => (
                <tr key={emi.id} className="hover:bg-slate-50/80 transition-all font-bold">
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-800">{emi.lead.name}</p>
                    <p className="text-[11px] text-slate-400 font-medium">Plot #{emi.plotNumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-600 flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {emi.project.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-800">₹{emi.totalPrice.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">Rate: ₹{emi.plotRate}/sqft</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-600">{new Date(emi.startDate).toLocaleDateString()}</p>
                    <p className="text-[10px] text-slate-400">Exp: {new Date(emi.expiryDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full border border-emerald-100">{emi.status}</span>
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
                  <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1 bg-white text-sm" value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}>
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Plot Number" required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={formData.plotNumber} onChange={e => setFormData({...formData, plotNumber: e.target.value})} />
                <input type="number" placeholder="Plot Rate" required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={formData.plotRate} onChange={e => setFormData({...formData, plotRate: e.target.value})} />
              </div>
              <input type="number" placeholder="Total Price" required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={formData.totalPrice} onChange={e => setFormData({...formData, totalPrice: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Start Date</label>
                  <input type="date" required className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Expiry Date</label>
                  <input type="date" required className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                </div>
              </div>
              <textarea placeholder="Plan Details (Interest, installments, etc.)" className="w-full px-4 py-3 rounded-xl border border-slate-200" value={formData.planDetails} onChange={e => setFormData({...formData, planDetails: e.target.value})} />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500">Cancel</button>
                <button type="submit" className="flex-2 px-8 py-3 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20">Active EMI</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
