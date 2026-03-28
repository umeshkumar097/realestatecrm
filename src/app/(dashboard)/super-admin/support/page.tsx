"use client"
import { useState, useEffect } from "react"
import { 
  ShieldCheck, ShieldAlert, MessageSquare,
  Users, Search, Clock, CheckCircle2,
  AlertCircle, ChevronRight, UserCircle2,
  Mail, Phone
} from "lucide-react"

export default function SupportManagementPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now
    const mockTickets = [
      { id: 'TIC-001', subject: 'WhatsApp QR not appearing', agency: 'Elite Realty', priority: 'HIGH', status: 'OPEN', createdAt: new Date(Date.now() - 3600000) },
      { id: 'TIC-002', subject: 'Billing issue with Pro plan', agency: 'Skyline Homes', priority: 'MEDIUM', status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 86400000) },
      { id: 'TIC-003', subject: 'Lead extraction failure', agency: 'Master Properties', priority: 'CRITICAL', status: 'OPEN', createdAt: new Date(Date.now() - 100000) },
    ]
    setTickets(mockTickets)
    setLoading(false)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Support Tickets</h1>
          <p className="text-zinc-500 text-sm font-bold">Manage agency tickets and resolve platform-wide issues.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex -space-x-3 overflow-hidden p-1">
                {[1,2,3].map(i => (
                    <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-zinc-200 flex items-center justify-center font-bold text-[10px] text-zinc-500">U</div>
                ))}
            </div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">3 Agents Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
            { name: 'Open Tickets', val: '12', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
            { name: 'Escalated', val: '3', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
            { name: 'Resolved', val: '142', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { name: 'Avg. Response', val: '12m', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
            <div key={s.name} className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm flex items-center gap-3">
                <div className={`w-9 h-9 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}>
                    <s.icon className="h-4 w-4" />
                </div>
                <div>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{s.name}</p>
                    <p className="text-lg font-black text-zinc-800">{s.val}</p>
                </div>
            </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="px-8 py-5 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <button className="text-sm font-black text-zinc-950 border-b-2 border-primary pb-5 -mb-5">Inbound Feed</button>
                <button className="text-sm font-bold text-zinc-400 hover:text-zinc-600 pb-5 -mb-5 transition-colors">Assigned to Me</button>
                <button className="text-sm font-bold text-zinc-400 hover:text-zinc-600 pb-5 -mb-5 transition-colors">Archive</button>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <input type="text" placeholder="Filter tickets..." className="pl-9 pr-4 py-1.5 bg-zinc-50 border border-zinc-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary w-48" />
            </div>
        </div>

        <div className="divide-y divide-zinc-50">
            {tickets.map(ticket => (
                <div key={ticket.id} className="p-6 hover:bg-zinc-50 transition-colors flex items-start justify-between group cursor-pointer">
                    <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                            ticket.priority === 'CRITICAL' ? 'bg-red-50 text-red-600' : 
                            ticket.priority === 'HIGH' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-black text-zinc-800 group-hover:text-primary transition-colors">{ticket.subject}</h3>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                                <span className="flex items-center gap-1"><UserCircle2 className="h-3 w-3" /> {ticket.agency}</span>
                                <span>•</span>
                                <span>{ticket.id}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(ticket.createdAt).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                        }`}>{ticket.status}</span>
                        <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}
