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

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/contacts")
        if (res.ok) setContacts(await res.json())
      } catch (e) {} finally { setLoading(false) }
    }
    load()
  }, [])

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
                       <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Edit3 className="h-4 w-4" /></button>
                       <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
