"use client"
import { useState, useEffect } from "react"
import { 
  Users, UserPlus, Mail, 
  Phone, Globe, Shield, 
  MoreHorizontal, Loader2,
  Trash2, Edit3, X
} from "lucide-react"

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/contacts")
      if (res.ok) setContacts(await res.json())
    } catch (e) {} finally { setLoading(false) }
  }

  useEffect(() => {
    load()
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMember) return
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    try {
      const res = await fetch(`/api/contacts/${editingMember.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData))
      })
      if (res.ok) {
        setShowEditModal(false)
        load()
      }
    } catch (e) { alert("Update failed") }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This agent will lose all access.")) return
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" })
      if (res.ok) load()
    } catch (e) { alert("Delete failed") }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4 italic font-black">
            <div className="p-3 bg-indigo-600/10 rounded-[20px] shadow-sm">
                <Users className="h-8 w-8 text-indigo-600" />
            </div>
            Operational Node Registry
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] ml-20 italic font-black">Overseeing {contacts.length} active administrative nodes within the global agency matrix</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic shadow-2xl shadow-slate-900/20 hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all group font-black">
           <UserPlus className="h-4 w-4 text-indigo-400" /> Initialize Agent Node
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-[48px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full border border-slate-100 flex-1 max-w-md shadow-sm group">
            <Globe className="h-4 w-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
            <input type="text" placeholder="Search master node registry by name or email..." className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-300 placeholder:italic" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Operational Member Node</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Governance Role</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Intelligence Ingress (Email)</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">Genesis Date</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-32 text-center text-slate-400">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto mb-6 text-indigo-500 opacity-20" />
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] italic text-slate-300">Synchronizing Master Node Registry...</p>
                  </td>
                </tr>
              ) : contacts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-all group font-black">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-black border-2 border-white shadow-xl shadow-slate-900/10 italic">
                         {c.name?.charAt(0) || "U"}
                       </div>
                       <p className="text-sm font-black text-slate-900 italic tracking-tight">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border shadow-sm tracking-[0.2em] italic uppercase ${
                      c.role === "AGENCY_OWNER" ? "bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-500/10" : "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-500/10"
                    }`}>
                      {c.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-[11px] font-black text-slate-500 italic tracking-tight">{c.email}</td>
                  <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] italic pt-1">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                         onClick={() => { setEditingMember(c); setShowEditModal(true) }}
                         className="p-3 bg-white shadow-xl rounded-[16px] text-slate-400 hover:text-indigo-600 border border-slate-100 transition-all hover:scale-110 active:scale-90"
                       >
                         <Edit3 className="h-4 w-4" />
                       </button>
                       <button 
                         onClick={() => handleDelete(c.id)}
                         className="p-3 bg-white shadow-xl rounded-[16px] text-slate-400 hover:text-rose-600 border border-slate-100 transition-all hover:scale-110 active:scale-90"
                       >
                         <Trash2 className="h-4 w-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {contacts.length === 0 && !loading && (
            <div className="p-32 text-center bg-white">
                <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-200 italic mb-4">Zero Human Capital Detected</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">No Operational Nodes Synchronized</p>
            </div>
        )}
      </div>

      {showEditModal && editingMember && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-6">
          <div className="bg-white rounded-[60px] p-12 w-full max-w-xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 border border-slate-100 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-10">
                <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Edit Operational Node</h2>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1 italic">Human Capital Governance Protocol Active</p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="p-4 hover:bg-slate-50 rounded-full transition-all text-slate-400"><X className="h-8 w-8" /></button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Full Node Designation (Name)</label>
                <input name="name" defaultValue={editingMember.name} required className="w-full px-8 py-5 rounded-[32px] border border-slate-50 mt-1 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/5 transition-all font-black" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Intelligence Ingress (Email Address)</label>
                <input name="email" type="email" defaultValue={editingMember.email} required className="w-full px-8 py-5 rounded-[32px] border border-slate-50 mt-1 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/5 transition-all font-black" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 italic tracking-[0.2em] font-black">Governance Role Selection</label>
                <select name="role" defaultValue={editingMember.role} className="w-full px-8 py-5 rounded-[32px] border border-slate-50 mt-1 bg-slate-50/50 text-sm font-black italic outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/5 transition-all appearance-none cursor-pointer font-black">
                  <option value="AGENT">AGENT Resolve</option>
                  <option value="AGENCY_OWNER">MASTER AGENCY OWNER (Governance)</option>
                </select>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-6 border border-slate-100 rounded-[32px] text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic hover:text-slate-900 transition-all font-black active:scale-95 font-black">Abort Configuration</button>
                <button type="submit" className="flex-[2] px-10 py-6 bg-slate-900 text-white rounded-[32px] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 transition-all italic font-black font-black">Authorize Node Realization ⚡</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
