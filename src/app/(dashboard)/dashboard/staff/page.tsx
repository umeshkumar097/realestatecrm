"use client"
import { useState, useEffect } from "react"
import { 
  Users, UserPlus, Shield, 
  Mail, Phone, MoreVertical,
  CheckCircle2, XCircle, Loader2,
  Lock, Eye, Edit3, Trash2
} from "lucide-react"

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBulkOpen, setIsBulkOpen] = useState(false)
  const [bulkData, setBulkData] = useState("")
  const [formData, setFormData] = useState({ name: "", email: "", role: "AGENT", password: "" })
  const [planLimit, setPlanLimit] = useState<{ current: number, max: number, name: string }>({ current: 0, max: 5, name: "Starter" })

  useEffect(() => {
    loadStaff()
  }, [])

  const loadStaff = async () => {
    try {
      const res = await fetch("/api/staff")
      if (res.ok) {
          const data = await res.json()
          setStaff(data)
          // Rough estimate, in real app we'd fetch agency details too
          setPlanLimit(prev => ({ ...prev, current: data.length }))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setIsModalOpen(false)
        setFormData({ name: "", email: "", role: "AGENT", password: "" })
        loadStaff()
      } else {
        const error = await res.json()
        alert(error.error || "Failed to create staff")
      }
    } catch (err) {
      alert("Error adding staff member")
    } finally {
      setLoading(false)
    }
  }

  const handleBulkAdd = async () => {
    setLoading(true)
    try {
        // Parse CSV-like: Name, Email, Password
        const lines = bulkData.split("\n").filter(l => l.trim().length > 0)
        const staffArr = lines.map(l => {
            const [name, email, password] = l.split(",").map(p => p.trim())
            return { name, email, password: password || "Agent@123", role: "AGENT" }
        })

        const res = await fetch("/api/staff/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ staff: staffArr })
        })
        const data = await res.json()
        if (res.ok) {
            alert(`Bulk Upload Complete! Successfully added ${data.results.filter((r: any) => r.status === "success").length} agents.`)
            setIsBulkOpen(false)
            setBulkData("")
            loadStaff()
        } else {
            alert(data.error || "Bulk upload failed")
        }
    } catch (err) {
        alert("Invalid format. Use: Name, Email, Password (one per line)")
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">Staff Management.</h1>
          <div className="flex items-center gap-3 mt-1">
             <p className="text-slate-500 text-sm font-medium">Manage your agency fleet of professionals.</p>
             <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950 text-white rounded-full text-[9px] font-black tracking-widest uppercase">
                <Users className="h-3 w-3 text-primary" /> {planLimit.current} / {planLimit.max} Active Seats
             </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={() => setIsBulkOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-zinc-200 text-zinc-600 rounded-xl text-sm font-black hover:bg-zinc-50 transition-all uppercase italic"
            >
                Bulk Activate
            </button>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all uppercase italic"
            >
                <UserPlus className="h-4 w-4" /> Add One
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:border-primary/20 transition-all relative overflow-hidden">
            {!member.emailVerified && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[8px] font-black px-4 py-1.5 uppercase tracking-widest rounded-bl-xl">
                    Awaiting Verification
                </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-primary font-black text-xl shadow-inner">
                {member.name?.charAt(0) || "S"}
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${member.role === 'ADMIN' ? 'bg-zinc-950 text-white' : 'bg-blue-50 text-blue-600'}`}>
                <Shield className="h-3 w-3" /> {member.role}
              </div>
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase italic">{member.name}</h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 font-medium">
                <Mail className={`h-3.5 w-3.5 ${member.emailVerified ? 'text-emerald-500' : 'text-slate-300'}`} /> 
                {member.email}
            </p>
            
            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"><Edit3 className="h-4 w-4" /></button>
                  <button className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all"><Lock className="h-4 w-4" /></button>
                </div>
                {member.emailVerified ? (
                    <div className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Identity Validated
                    </div>
                ) : (
                    <button className="text-[9px] font-black text-blue-500 hover:underline uppercase tracking-widest">Resend Invite</button>
                )}
            </div>
          </div>
        ))}
        {staff.length === 0 && !loading && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-100 rounded-[48px] text-slate-300">
             <Users className="h-16 w-16 mx-auto mb-4 opacity-10" />
             <p className="text-base font-black uppercase tracking-widest italic">No Professionals Deployed</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3 tracking-tighter uppercase italic">
              <UserPlus className="h-7 w-7 text-primary" /> Onboard Agent.
            </h2>
            <form onSubmit={handleCreateStaff} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Full Name</label>
                <input type="text" placeholder="e.g. Rahul Kumar" required className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 font-bold focus:ring-2 focus:ring-primary outline-none mt-1 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Email Address</label>
                <input type="email" placeholder="rahul@agency.com" required className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 font-bold focus:ring-2 focus:ring-primary outline-none mt-1 transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Temp Password</label>
                <input type="password" required className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 font-bold focus:ring-2 focus:ring-primary outline-none mt-1 transition-all" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Permissions</label>
                <select className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 font-bold text-sm outline-none mt-1" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="AGENT">Sales Agent (Standard)</option>
                  <option value="ADMIN">Agency Admin (Full Control)</option>
                </select>
              </div>
              <div className="flex gap-4 pt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Abort</button>
                <button type="submit" disabled={loading} className="flex-2 px-10 py-4 bg-zinc-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Deploy Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBulkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-2xl shadow-2xl border border-slate-100 animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex justify-between items-start mb-8">
                <div>
                   <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tighter uppercase italic">
                     Bulk Agent Activation.
                   </h2>
                   <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Instant Team Onboarding</p>
                </div>
                <button onClick={() => setIsBulkOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl"><XCircle className="h-6 w-6 text-slate-300" /></button>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl mb-8">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">Data Format Required:</p>
                <code className="text-xs font-bold text-blue-900 block bg-white/50 p-3 rounded-xl border border-blue-200">
                    Full Name, email@address.com, password
                </code>
                <p className="text-[9px] font-bold text-blue-400 mt-3 italic">* One agent per line. Password is optional (default: Agent@123)</p>
            </div>

            <textarea 
                rows={8}
                placeholder="Rahul Kumar, rahul@agency.com, pass123&#10;Amit Singh, amit@agency.com"
                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[32px] font-bold text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-300"
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
            />

            <div className="flex justify-end gap-4 mt-10">
                <button type="button" onClick={() => setIsBulkOpen(false)} className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Cancel</button>
                <button 
                  onClick={handleBulkAdd}
                  disabled={loading || !bulkData}
                  className="px-12 py-5 bg-primary text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Authorise Batch Activation"}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
