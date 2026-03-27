"use client"
import { useState, useEffect } from "react"
import { 
  Building2, CreditCard, Calendar, 
  MapPin, Clock, MessageSquare,
  ChevronRight, BadgeInfo, CheckCircle2,
  Phone, Mail, User, Plus, ShieldAlert, Loader2
} from "lucide-react"
import React from "react"

export default function ClientPortalPage({ params }: { params: Promise<{ agencyId: string, leadId: string }> }) {
  const { agencyId, leadId } = React.use(params)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPortal() {
      try {
        const res = await fetch(`/api/portal/${agencyId}/${leadId}`)
        if (res.ok) {
          setData(await res.json())
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadPortal()
  }, [agencyId, leadId])

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
  
  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-8 bg-white rounded-3xl border border-slate-100 shadow-xl max-w-sm">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-slate-800">Invalid Link</h2>
        <p className="text-sm text-slate-500 mt-2">This portal link is invalid or has expired. Please contact your agency.</p>
      </div>
    </div>
  )

  const { lead, emis, projects, tickets, agency } = data

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Brand Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xs">RE</div>
          <div>
            <h1 className="text-sm font-black text-slate-800 uppercase tracking-tight">{agency.name}</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Client Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-all"><Phone className="h-4 w-4" /></button>
          <button className="p-2.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-all"><MessageSquare className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-8 space-y-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[40px] text-white shadow-2xl overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-2xl font-black">Welcome back, {lead.name}</h2>
            <p className="text-slate-400 text-sm mt-1">Track your property investments and payment schedules in real-time.</p>
            <div className="mt-8 flex flex-wrap gap-4">
               <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
                 <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Total Assets</p>
                 <p className="text-lg font-black">{emis.length} Properties</p>
               </div>
               <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
                 <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Active EMIs</p>
                 <p className="text-lg font-black">{emis.filter((e: any) => e.status === 'ACTIVE').length}</p>
               </div>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
        </div>

        {/* EMI Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Property Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emis.map((emi: any) => (
              <div key={emi.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all"><Building2 className="h-6 w-6" /></div>
                  <span className="text-[10px] font-black px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 uppercase">{emi.status}</span>
                </div>
                <h4 className="text-base font-black text-slate-800">{emi.project.name}</h4>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Plot No: {emi.plotNumber}</p>
                
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-400">Total Price</span>
                    <span className="text-slate-800">₹{emi.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-400">Next Due</span>
                    <span className="text-amber-600">{new Date(emi.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <button className="w-full mt-6 py-3 bg-slate-50 text-slate-800 rounded-2xl text-xs font-black hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                  View Detail Plan <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Support Tickets */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Support & Tickets</h3>
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
             {tickets.map((ticket: any) => (
               <div key={ticket.id} className="p-5 border-b border-slate-50 last:border-0 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><MessageSquare className="h-4 w-4" /></div>
                   <div>
                     <p className="text-sm font-black text-slate-800">{ticket.subject}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{ticket.type} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                   </div>
                 </div>
                 <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${ticket.status === 'OPEN' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    {ticket.status}
                 </span>
               </div>
             ))}
             <button className="w-full p-4 text-[10px] font-black text-primary hover:bg-slate-50 flex items-center justify-center gap-2 uppercase tracking-widest">
                Create Support Ticket <Plus className="h-3 w-3" />
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Icons handled via lucide-react import */
