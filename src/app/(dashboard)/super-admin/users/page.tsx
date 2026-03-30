"use client"

import { useState, useEffect } from "react"
import { 
  Users, Search, Edit2, Trash2, Shield, 
  Mail, Building2, Calendar, Loader2, X
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUser, setEditingUser] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", role: "" })

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/super-admin/users")
      if (res.ok) setUsers(await res.json())
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  useEffect(() => { loadUsers() }, [])

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setFormData({ name: user.name || "", email: user.email, role: user.role })
    setIsEditModalOpen(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/super-admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setIsEditModalOpen(false)
        loadUsers()
      }
    } catch (e) { alert("Update failed") }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this user?")) return
    try {
      const res = await fetch(`/api/super-admin/users/${id}`, { method: "DELETE" })
      if (res.ok) loadUsers()
    } catch (e) { alert("Delete failed") }
  }

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Active User Directory</h1>
          <p className="text-zinc-500 text-sm">Manage all platform members across every agency.</p>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-100">
              <th className="px-6 py-4 text-left text-[10px] font-black text-zinc-400 uppercase tracking-widest">User Details</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-zinc-400 uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-zinc-400 uppercase tracking-widest">Agency</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-zinc-400 uppercase tracking-widest">Joined</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-zinc-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="group hover:bg-zinc-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-600">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-800">{user.name || "Unnamed User"}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                    user.role === 'SUPER_ADMIN' ? "bg-red-50 text-red-600" :
                    user.role === 'AGENCY_OWNER' ? "bg-primary/10 text-primary" : "bg-zinc-100 text-zinc-600"
                  )}>
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-zinc-600">
                  {user.agency?.name || "No Agency"}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500 font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(user)} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-zinc-200 text-zinc-600 transition-all">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 text-red-600 transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div>
                <h2 className="text-xl font-black tracking-tight">Edit Member</h2>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">ID: {editingUser.id}</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-white rounded-xl border border-zinc-200 transition-all">
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">User Role</label>
                <select 
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium appearance-none"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="SUPER_ADMIN">SUPER ADMIN</option>
                  <option value="AGENCY_OWNER">AGENCY OWNER</option>
                  <option value="ADMIN">ADMIN (AGENCY)</option>
                  <option value="AGENT">AGENT</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-bold hover:bg-zinc-200 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
