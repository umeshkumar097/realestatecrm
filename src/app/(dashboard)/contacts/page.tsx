"use client"
import { useState, useEffect } from "react"
import { 
  Users, UserPlus, Mail, 
  Phone, Globe, Shield, 
  MoreHorizontal, Loader2,
  Trash2, Edit3
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight text-premium">Team Directory</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage agents and collaborators within your agency.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-extrabold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
           <UserPlus className="h-4 w-4" /> Invite Agent
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Member</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Email</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">Join Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading team members...
                  </td>
                </tr>
              ) : contacts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 tracking-tighter uppercase">
                         {c.name?.charAt(0) || "U"}
                       </div>
                       <p className="text-sm font-black text-slate-800">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                      c.role === "AGENCY_OWNER" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {c.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-500">{c.email}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-300">
                       <button 
                         onClick={() => {
                           setEditingMember(c)
                           setShowEditModal(true)
                         }}
                         className="p-2 hover:bg-slate-100 hover:text-primary rounded-lg transition-colors"
                       >
                         <Edit3 className="h-4 w-4" />
                       </button>
                       <button 
                         onClick={() => handleDelete(c.id)}
                         className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
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
      </div>

      {showEditModal && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">Edit Team Member</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Full Name</label>
                <input name="name" defaultValue={editingMember.name} required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Email Address</label>
                <input name="email" type="email" defaultValue={editingMember.email} required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">System Role</label>
                <select name="role" defaultValue={editingMember.role} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold">
                  <option value="AGENT">AGENT</option>
                  <option value="AGENCY_OWNER">AGENCY OWNER</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500">Cancel</button>
                <button type="submit" className="flex-2 px-8 py-3 bg-primary text-white rounded-xl font-extrabold shadow-lg">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
