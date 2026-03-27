"use client"
import { useState, useEffect } from "react"
import { 
  Ticket, MessageSquare, Clock, 
  CheckCircle2, Plus, Building2, 
  ArrowRight, Search, Filter,
  Phone, User, CreditCard, ShieldAlert
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Ticketing System</h1>
          <p className="text-slate-500 text-sm mt-0.5">Handle support requests, EMI queries, and payment issues.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-extrabold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" /> Create Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Open Issues", value: tickets.filter(t => t.status === 'OPEN').length, icon: ShieldAlert, color: "text-red-600 bg-red-50" },
          { label: "In Progress", value: tickets.filter(t => t.status === 'IN_PROGRESS').length, icon: Clock, color: "text-amber-600 bg-amber-50" },
          { label: "Resolved", value: tickets.filter(t => t.status === 'CLOSED').length, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
          { label: "EMI Support", value: tickets.filter(t => t.type === 'EMI').length, icon: CreditCard, color: "text-blue-600 bg-blue-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 flex-1 max-w-md">
            <Search className="h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Search by subject or lead..." className="w-full bg-transparent border-none focus:ring-0 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50"><Filter className="h-4 w-4 text-slate-500" /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Issue Description</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Type</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Client & Project</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Assigned To</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/80 transition-all font-bold">
                  <td className="px-6 py-4 max-w-sm">
                    <p className="text-sm text-slate-800 truncate">{ticket.subject}</p>
                    <p className="text-[11px] text-slate-400 font-medium truncate">{ticket.description || "No description provided"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg border border-blue-100 uppercase">{ticket.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-700">{ticket.lead?.name}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1"><Building2 className="h-3 w-3" /> {ticket.project?.name || "General Support"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black">
                         {ticket.assignedTo?.name?.charAt(0) || "U"}
                       </div>
                       <p className="text-xs text-slate-600">{ticket.assignedTo?.name || "Unassigned"}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full border ${
                      ticket.status === 'OPEN' ? 'bg-red-50 text-red-600 border-red-100' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {ticket.status}
                    </span>
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
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-slate-100">
            <h2 className="text-xl font-black text-slate-900 mb-6">Create Support Ticket</h2>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <input 
                type="text" placeholder="Subject" required 
                className="w-full px-4 py-3 rounded-xl border border-slate-200"
                value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
              />
              <textarea 
                placeholder="Details of the issue or inquiry"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 h-24"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white"
                  value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="SUPPORT">General Support</option>
                  <option value="EMI">EMI Query</option>
                  <option value="PAYMENT">Payment Issue</option>
                </select>
                <input 
                  type="text" placeholder="Lead ID" required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm"
                  value={formData.leadId} onChange={e => setFormData({...formData, leadId: e.target.value})}
                />
              </div>
              <input 
                type="text" placeholder="Project ID (Optional)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm"
                value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})}
              />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500">Cancel</button>
                <button type="submit" className="flex-2 px-8 py-3 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20">Create Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
