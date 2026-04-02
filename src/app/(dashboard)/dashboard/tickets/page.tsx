"use client"
import { useState, useEffect } from "react"
import { 
  Ticket, MessageSquare, Clock, 
  CheckCircle2, Plus, Building2, 
  ArrowRight, Search, Filter,
  Phone, User, CreditCard, ShieldAlert, X
} from "lucide-react"

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ subject: "", description: "", type: "SUPPORT", leadId: "", projectId: "" })

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      const res = await fetch("/api/tickets")
      setTickets(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setIsModalOpen(false)
        setFormData({ subject: "", description: "", type: "SUPPORT", leadId: "", projectId: "" })
        loadTickets()
      }
    } catch (err) {
      alert("Failed to create ticket")
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4 italic font-black">
            <div className="p-3 bg-blue-600/10 rounded-[20px] shadow-sm">
                <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            Support Node Governance
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] ml-20 italic">Managing {tickets.length} active resolve nodes within the global intelligence registry</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all group"
        >
          <Plus className="h-4 w-4 text-emerald-400" /> Initialize Resolve Node
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: "Critical Priority", value: tickets.filter(t => t.status === 'OPEN').length, icon: ShieldAlert, color: "text-rose-600 bg-rose-50", bar: "bg-rose-500" },
          { label: "Active Resolves", value: tickets.filter(t => t.status === 'IN_PROGRESS').length, icon: Clock, color: "text-amber-600 bg-amber-50", bar: "bg-amber-500" },
          { label: "Resolved Matrix", value: tickets.filter(t => t.status === 'CLOSED').length, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50", bar: "bg-emerald-500" },
          { label: "Fiscal Support", value: tickets.filter(t => t.type === 'EMI').length, icon: CreditCard, color: "text-blue-600 bg-blue-50", bar: "bg-blue-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
            <div className="flex items-center gap-6">
                <div className={`p-4 rounded-[24px] ${stat.color}`}><stat.icon className="h-7 w-7" /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1 italic">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{stat.value}</p>
                </div>
            </div>
            <div className={`mt-5 w-12 h-1 ${stat.bar} rounded-full transition-all group-hover:w-20`} />
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-[48px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full border border-slate-100 flex-1 max-w-md shadow-sm group">
            <Search className="h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
            <input type="text" placeholder="Search master resolve matrix by subject or client..." className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-300 placeholder:italic" />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:bg-slate-900 hover:text-white transition-all italic font-black">
            <Filter className="h-4 w-4" /> Filter Matrix
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Issue Intelligence Descriptor</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Node Type</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Client & Asset Node</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Resolve Officer</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Operational Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-10 py-6 max-w-sm">
                    <p className="text-sm font-black text-slate-900 italic tracking-tight truncate">{ticket.subject}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 italic truncate">{ticket.description || "Zero Intelligence Payload"}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100 uppercase tracking-[0.2em] italic">{ticket.type}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900 italic">{ticket.lead?.name}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-1.5 mt-1 italic"><Building2 className="h-3.5 w-3.5 text-emerald-500" /> {ticket.project?.name || "Global Support Node"}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xl shadow-slate-900/10 italic">
                         {ticket.assignedTo?.name?.charAt(0) || "U"}
                       </div>
                       <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] italic">{ticket.assignedTo?.name || "Unassigned"}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-black px-4 py-2 rounded-full border tracking-[0.3em] uppercase italic shadow-sm ${
                      ticket.status === 'OPEN' ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-500/10' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-500/10' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/10'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="p-3 bg-white shadow-xl rounded-[16px] text-slate-400 hover:text-blue-600 border border-slate-100 transition-all hover:scale-110 active:scale-90 opacity-0 group-hover:opacity-100 italic"><ArrowRight className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tickets.length === 0 && (
            <div className="p-32 text-center bg-white">
                <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-200 italic mb-4">Master Intelligence Registry Empty</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">No Resolve Nodes Active in Matrix</p>
            </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-6">
          <div className="bg-white rounded-[60px] p-12 w-full max-w-xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 border border-slate-100 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-10">
                <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Initialize Resolve Node</h2>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1 italic">Intelligence Genesis Protocol Active</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-slate-50 rounded-full transition-all text-slate-400"><X className="h-8 w-8" /></button>
            </div>
            
            <form onSubmit={handleCreateTicket} className="space-y-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Issue Intelligence Subject</label>
                 <input 
                   type="text" placeholder="e.g. Asset Amortization Node Mismatch" required 
                   className="w-full px-8 py-5 rounded-[32px] border border-slate-50 mt-1 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-black"
                   value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Resolve Intelligence Payload</label>
                 <textarea 
                   placeholder="Outline the technical or client particulars of this node..."
                   className="w-full px-8 py-6 rounded-[32px] border border-slate-50 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all leading-relaxed font-black"
                   value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                   rows={3}
                 />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Node Classification</label>
                  <select 
                    className="w-full px-8 py-5 rounded-[32px] border border-slate-50 mt-1 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all appearance-none cursor-pointer font-black"
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="SUPPORT">General Support Hub</option>
                    <option value="EMI">Fiscal/EMI Node</option>
                    <option value="PAYMENT">Ingress/Payment Issues</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Target Client Node ID</label>
                  <input 
                    type="text" placeholder="Cluster Associate ID" required 
                    className="w-full px-8 py-5 rounded-[32px] border border-slate-50 mt-1 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-black"
                    value={formData.leadId} onChange={e => setFormData({...formData, leadId: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Project Portfolio Mapping (Optional)</label>
                 <input 
                    type="text" placeholder="Regional Project Cluster ID"
                    className="w-full px-8 py-5 rounded-[32px] border border-slate-50 mt-1 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all font-black"
                    value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}
                 />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-6 border border-slate-100 rounded-[32px] text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic hover:text-slate-900 transition-all font-black active:scale-95">Abort Genesis</button>
                <button type="submit" className="flex-[2] px-10 py-6 bg-slate-900 text-white rounded-[32px] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all italic font-black">Authorize Resolve Node ⚡</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
