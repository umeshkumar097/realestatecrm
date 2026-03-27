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
  const [formData, setFormData] = useState({ name: "", email: "", role: "AGENT", password: "" })

  useEffect(() => {
    loadStaff()
  }, [])

  const loadStaff = async () => {
    try {
      const res = await fetch("/api/staff")
      if (res.ok) setStaff(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault()
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
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Staff Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage agents, administrators, and their access permissions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-extrabold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
        >
          <UserPlus className="h-4 w-4" /> Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-primary font-black text-lg">
                {member.name?.charAt(0) || "S"}
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${member.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                <Shield className="h-3 w-3" /> {member.role}
              </div>
            </div>
            <h3 className="text-base font-black text-slate-800">{member.name}</h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {member.email}</p>
            
            <div className="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black text-slate-600 transition-all">
                <Edit3 className="h-3 w-3" /> EDIT
              </button>
              <button className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black text-slate-600 transition-all">
                <Lock className="h-3 w-3" /> ACCESS
              </button>
            </div>
          </div>
        ))}
        {staff.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-300">
             <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
             <p className="text-sm font-bold">No staff members found</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <UserPlus className="h-6 w-6 text-primary" /> Add New Staff
            </h2>
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                <input type="text" placeholder="e.g. Rahul Kumar" required className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Address</label>
                <input type="email" placeholder="rahul@agency.com" required className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Temporary Password</label>
                <input type="password" required className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Role & Permissions</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 mt-1 text-sm bg-white" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="AGENT">Sales Agent (Client Access Only)</option>
                  <option value="ADMIN">System Admin (Full Access)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500">Cancel</button>
                <button type="submit" className="flex-2 px-8 py-3 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
