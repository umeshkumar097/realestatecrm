"use client"

import { useState, useEffect } from "react"
import { 
  Building2, Plus, Search, 
  MapPin, IndianRupee, LayoutGrid, 
  List, ArrowUpRight, Filter, 
  Loader2, Edit3, Trash2, PieChart,
  HardHat, Info, Activity
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
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4 italic font-black">
             <div className="p-3 bg-blue-600/10 rounded-[20px] shadow-sm">
               <Building2 className="h-8 w-8 text-blue-600" />
             </div>
             Development Portfolio Hub
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] ml-20 italic">Managing {projects.length} architectural sectors across the global cluster</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all group"
        >
           <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform text-blue-400" /> 
           Authorize Portfolio Node
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
             <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] mb-2 italic">Active Sectors</p>
             <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{projects.length}</p>
             <div className="mt-3 w-8 h-1 bg-blue-600 rounded-full" />
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
             <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] mb-2 italic">Total Unit Yield</p>
             <p className="text-3xl font-black text-slate-900 italic tracking-tighter">
               {projects.reduce((acc, p) => acc + (p._count?.properties || 0), 0)}
             </p>
             <div className="mt-3 w-8 h-1 bg-emerald-500 rounded-full" />
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all">
             <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] mb-2 italic">Global Regions</p>
             <p className="text-3xl font-black text-slate-900 italic tracking-tighter">
               {new Set(projects.map(p => p.location)).size}
             </p>
             <div className="mt-3 w-8 h-1 bg-amber-500 rounded-full" />
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] mb-2 italic">Governance Status</p>
                <p className="text-3xl font-black text-blue-600 italic tracking-tighter uppercase italic">Active</p>
                <div className="mt-3 w-8 h-1 bg-slate-900 rounded-full" />
             </div>
             <Activity className="absolute -right-4 -bottom-4 h-24 w-24 text-slate-50 opacity-50" />
          </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-5 p-1.5 bg-white border border-slate-100 rounded-full shadow-sm group focus-within:shadow-xl transition-all">
         <div className="flex-1 flex items-center gap-4 px-6 py-3 group">
            <Search className="h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search global portfolios by sector name or architectural region..." 
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-300 text-slate-800 placeholder:italic" 
            />
         </div>
         <button className="flex items-center gap-3 px-8 py-3.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:bg-slate-900 hover:text-white transition-all italic">
           <Filter className="h-4 w-4" /> Filter Portfolios
         </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 space-y-6">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 opacity-40" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic font-bold">Syncing Global Portfolio Matrix...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-32 text-center bg-white border-2 border-dashed border-slate-100 rounded-[60px] space-y-8 shadow-sm">
           <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto shadow-inner border border-slate-100">
             <HardHat className="h-10 w-10 text-slate-200" />
           </div>
           <div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">No Portfolio Nodes established</h2>
             <p className="text-slate-400 font-black uppercase tracking-[0.15em] max-w-sm mx-auto mt-4 italic text-[10px] leading-relaxed">
               You must initialize a master sector node before you can link individual asset nodes and fiscal EMI schedules.
             </p>
           </div>
           <button 
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all italic"
            >
              Initialize Master Sector Node
            </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {projects.map((p) => (
            <div key={p.id} className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all group flex flex-col border-b-[6px] border-b-slate-50 hover:border-b-blue-600">
              <div className="p-10 flex flex-col md:flex-row items-start justify-between gap-8 flex-1">
                <div className="space-y-6 flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)] animate-pulse" />
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] italic opacity-60 font-bold leading-none">Global Sector Node</p>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic group-hover:text-blue-600 transition-colors leading-none">{p.name}</h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2 font-bold italic pt-1"><MapPin className="h-4 w-4 text-rose-500" /> {p.location}</p>
                  </div>
                  
                  <p className="text-[13px] text-slate-500 font-bold italic leading-relaxed opacity-80 border-l-2 border-slate-100 pl-4">
                    {p.description || "No developmental insights provided. Update the sector profile to include mission-critical architectural notes."}
                  </p>

                  <div className="flex gap-6 pt-2">
                    <div className="px-6 py-4 bg-slate-50/50 rounded-[28px] border border-slate-50 flex-1 shadow-inner group-hover:bg-white group-hover:border-blue-50 transition-all">
                      <p className="text-[8px] font-black uppercase text-slate-300 tracking-[0.2em] mb-2 italic">Asset Nodes</p>
                      <p className="text-xl font-black text-slate-900 tracking-tighter italic italic leading-none">{p._count?.properties || 0}</p>
                    </div>
                    <div className="px-6 py-4 bg-slate-50/50 rounded-[28px] border border-slate-50 flex-1 shadow-inner group-hover:bg-white group-hover:border-emerald-50 transition-all">
                      <p className="text-[8px] font-black uppercase text-slate-300 tracking-[0.2em] mb-2 italic">Active Fiscal</p>
                      <p className="text-xl font-black text-slate-900 tracking-tighter italic italic leading-none">{p._count?.emis || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-3">
                  <button className="p-4 bg-white shadow-xl rounded-[20px] text-slate-400 hover:text-blue-600 border border-slate-100 transition-all active:scale-90 shadow-blue-900/5">
                    <ArrowUpRight className="h-5 w-5" />
                  </button>
                  <button className="p-4 bg-white shadow-xl rounded-[20px] text-slate-400 hover:text-slate-900 border border-slate-100 transition-all active:scale-90">
                    <Edit3 className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="p-4 bg-white shadow-xl rounded-[20px] text-slate-400 hover:text-rose-600 border border-slate-100 transition-all active:scale-90 shadow-rose-900/5"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                <div className="flex items-center gap-5">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400 transition-transform group-hover:scale-110 group-hover:border-white/20">
                        {i}
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic group-hover:text-blue-400">Node Governors Active</p>
                </div>
                <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] italic leading-none">
                    Phase: Architectural
                    </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Initialize / Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-6">
          <div className="bg-white rounded-[60px] p-12 w-full max-w-xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 border border-slate-100 overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 select-none pointer-events-none grayscale">
              <Building2 size={240} />
            </div>

            <div className="space-y-2 mb-10 relative">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">Establish Portfolio Node</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] italic font-black">Authorized Portfolio Establishment Protocol</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8 relative">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1 italic font-black">Node Signature (Site/Project Name)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Royal Heritage Hub Phase II" 
                  required 
                  className="w-full px-8 py-5 bg-slate-50/50 border border-slate-50 rounded-[28px] text-sm font-black focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none placeholder:italic" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1 italic font-black">Architectural Sector Region (Location)</label>
                <div className="relative">
                  <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="e.g. Dubai Hills, Sector 12" 
                    required 
                    className="w-full pl-16 pr-8 py-5 bg-slate-50/50 border border-slate-50 rounded-[28px] text-sm font-black focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none placeholder:italic" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1 italic font-black">Developer Insights & Mission Goals</label>
                <textarea 
                  placeholder="Summarize high-value project goals, luxury amenities, or master plan status..." 
                  rows={4}
                  className="w-full px-8 py-6 bg-slate-50/50 border border-slate-50 rounded-[32px] text-sm font-black focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none placeholder:italic leading-relaxed" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-6 border border-slate-100 rounded-[32px] font-black uppercase tracking-[0.3em] text-[10px] text-slate-300 hover:text-slate-900 transition-all italic font-black active:scale-95"
                >
                  Discard Node
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-[2] px-10 py-6 bg-slate-900 text-white rounded-[32px] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-4 italic font-black"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                      Finalizing Node Ingress...
                    </>
                  ) : (
                    <>Establish Sector Node <Activity className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-50 flex items-center gap-4 text-slate-300">
               <Info size={16} className="text-blue-400" />
               <p className="text-[9px] font-black uppercase tracking-[0.1em] italic leading-tight">Attention: Authorizing the creation of a master portfolio node will synchronize assets across all regional clusters.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
