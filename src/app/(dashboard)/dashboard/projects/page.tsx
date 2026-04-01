"use client"

import { useState, useEffect } from "react"
import { 
  Building2, Plus, Search, 
  MapPin, IndianRupee, LayoutGrid, 
  List, ArrowUpRight, Filter, 
  Loader2, Edit3, Trash2, PieChart,
  HardHat, Info
} from "lucide-react"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", location: "", description: "" })
  const [submitting, setSubmitting] = useState(false)

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/projects")
      if (res.ok) setProjects(await res.json())
    } catch (e) {
      console.error("Failed to load projects", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProjects() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setIsModalOpen(false)
        setFormData({ name: "", location: "", description: "" })
        loadProjects()
      } else {
        const errorData = await res.json()
        alert(errorData.error || "Failed to create project")
      }
    } catch (e) {
      alert("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project? All associated inventory will be affected.")) return
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (res.ok) loadProjects()
      else alert("Delete failed. Some projects might have active properties.")
    } catch (e) {
      alert("Delete failed")
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-xl">
               <Building2 className="h-6 w-6 text-primary" />
             </div>
             Development Projects
          </h1>
          <p className="text-slate-500 text-sm font-medium ml-1">Master portfolio of real estate developments and township sites.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group"
        >
           <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" /> 
           Establish New Project
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Active Sites</p>
             <p className="text-2xl font-black text-slate-800">{projects.length}</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Managed Units</p>
             <p className="text-2xl font-black text-slate-800">
               {projects.reduce((acc, p) => acc + (p._count?.properties || 0), 0)}
             </p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Locations</p>
             <p className="text-2xl font-black text-slate-800">
               {new Set(projects.map(p => p.location)).size}
             </p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm border-l-4 border-l-emerald-500">
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Site Progress</p>
             <p className="text-2xl font-black text-emerald-600">Active</p>
          </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
         <div className="flex-1 flex items-center gap-4 px-4 py-2 group">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by project name or township location..." 
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-400 text-slate-800" 
            />
         </div>
         <div className="h-8 w-px bg-slate-100 mx-2" />
         <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">
           <Filter className="h-4 w-4" /> Filter Portfolio
         </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Portfolio...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-20 text-center bg-white border-2 border-dashed border-slate-100 rounded-[48px] space-y-6">
           <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto">
             <HardHat className="h-10 w-10 text-slate-200" />
           </div>
           <div>
             <h2 className="text-xl font-black text-slate-800 tracking-tight">No Projects Established</h2>
             <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2 italic text-sm">
               You need to create your first project site before you can link individual inventory units and EMI plans.
             </p>
           </div>
           <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 bg-primary text-white rounded-2xl text-sm font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Initialize First Project
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all group border-b-4 border-b-zinc-50 hover:border-b-primary">
              <div className="p-8 flex items-start justify-between">
                <div className="space-y-4 flex-1">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-primary transition-colors">{p.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 font-bold"><MapPin className="h-3.5 w-3.5 text-rose-500" /> {p.location}</p>
                  </div>
                  
                  <p className="text-sm text-slate-500 font-medium line-clamp-2 italic leading-relaxed">
                    {p.description || "No project overview provided. Use the edit feature to add developer notes."}
                  </p>

                  <div className="flex gap-4 pt-2">
                    <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex-1">
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Units</p>
                      <p className="text-lg font-black text-slate-800 tracking-tighter">{p._count?.properties || 0}</p>
                    </div>
                    <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex-1">
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Active EMIs</p>
                      <p className="text-lg font-black text-slate-800 tracking-tighter">{p._count?.emis || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  <button className="p-3 bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all shadow-sm">
                    <ArrowUpRight className="h-5 w-5" />
                  </button>
                  <button className="p-3 bg-slate-50 text-slate-400 hover:bg-zinc-800 hover:text-white rounded-2xl transition-all shadow-sm">
                    <Edit3 className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="p-3 bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[8px] font-black text-slate-400">
                        {i}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Assigned</p>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                  Status: Development
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Initialize / Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          
          <div className="bg-white rounded-[40px] p-10 w-full max-w-xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 border border-slate-100 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 select-none pointer-events-none">
              <Building2 size={160} />
            </div>

            <div className="space-y-2 mb-8 relative">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Project Establishment</h2>
              <p className="text-slate-400 font-medium text-sm">Define a new site or township to start managing inventory and schedules.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Site / Project Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Royal Heritage Heights Phase II" 
                  required 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-slate-300" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Google Maps / Site Location</label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="e.g. Sector 12, Civil Lines, Udaipur" 
                    required 
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-slate-300" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Developer Insights (Optional)</label>
                <textarea 
                  placeholder="Summarize project goals, amenities, or site status..." 
                  rows={4}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-slate-300" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-4 border-2 border-slate-100 rounded-3xl font-black uppercase tracking-widest text-[11px] text-slate-300 hover:bg-slate-50 transition-all active:scale-95"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-[2] px-10 py-5 bg-primary text-white rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      Finalizing Site...
                    </>
                  ) : (
                    "Authorize Project Creation"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-3 text-slate-300">
               <Info size={16} />
               <p className="text-[9px] font-bold uppercase tracking-tighter">Authorized Agency Signature Required. This action will create a master site record across the agency database.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
