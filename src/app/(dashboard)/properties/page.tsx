"use client"
import { useState, useEffect } from "react"
import { 
  Building2, Plus, Search, 
  MapPin, IndianRupee, Bed, 
  Bath, Square, ArrowUpRight,
  Filter, Home, Loader2, Edit3, Trash2,
  Box, Tags, X
} from "lucide-react"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<any>(null)
  const [formData, setFormData] = useState({ 
    title: "", 
    price: "", 
    location: "", 
    type: "APARTMENT", 
    beds: "", 
    baths: "", 
    area: "",
    projectId: "" 
  })

  const loadData = async () => {
    try {
      const [resProps, resProjects] = await Promise.all([
        fetch("/api/properties"),
        fetch("/api/projects")
      ])
      
      if (resProps.ok) setProperties(await resProps.json())
      if (resProjects.ok) setProjects(await resProjects.json())
    } catch (e) {
        console.error("Data load failed", e)
    } finally { 
        setLoading(false) 
    }
  }

  useEffect(() => { loadData() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
          ...formData,
          price: formData.type === "LAND" ? 0 : parseFloat(formData.price || "0"),
          beds: formData.type === "LAND" ? 0 : parseInt(formData.beds || "0"),
          baths: formData.type === "LAND" ? 0 : parseFloat(formData.baths || "0"),
          area: formData.type === "LAND" ? 0 : parseFloat(formData.area || "0"),
      }
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setIsModalOpen(false)
        setFormData({ title: "", price: "", location: "", type: "APARTMENT", beds: "", baths: "", area: "", projectId: "" })
        loadData()
      } else {
        const errorData = await res.json()
        alert(errorData.error || "Failed to add unit")
      }
    } catch (e) { alert("Network error. Please try again.") }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProperty) return
    try {
      const payload = {
          ...formData,
          price: formData.type === "LAND" ? 0 : parseFloat(formData.price || "0"),
          beds: formData.type === "LAND" ? 0 : parseInt(formData.beds || "0"),
          baths: formData.type === "LAND" ? 0 : parseFloat(formData.baths || "0"),
          area: formData.type === "LAND" ? 0 : parseFloat(formData.area || "0"),
      }
      const res = await fetch(`/api/properties/${editingProperty.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setIsEditModalOpen(false)
        setEditingProperty(null)
        setFormData({ title: "", price: "", location: "", type: "APARTMENT", beds: "", baths: "", area: "", projectId: "" })
        loadData()
      } else {
        const errorData = await res.json()
        alert(errorData.error || "Failed to update unit")
      }
    } catch (e) { alert("Network error. Please try again.") }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inventory unit?")) return
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" })
      if (res.ok) loadData()
    } catch (e) { alert("Delete failed") }
  }

  return (
    <div className="space-y-10 relative min-h-screen pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3 italic">
            <Box className="h-8 w-8 text-blue-600" />
            Sector Inventory Hub
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] ml-1 italic">Managing {properties.length} active asset nodes within the global cluster</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all"
        >
           <Plus className="h-4 w-4" /> Forge Asset Node
        </button>
      </div>

      <div className="flex items-center gap-5 p-1.5 bg-white border border-slate-100 rounded-full shadow-sm group focus-within:shadow-xl transition-all">
         <div className="flex-1 flex items-center gap-4 px-6 py-3 text-slate-300">
            <Search className="h-4 w-4 group-focus-within:text-blue-600 transition-colors" />
            <input type="text" placeholder="Search global inventory vector (location, asset title or mapping)..." className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-300 text-slate-800 placeholder:italic" />
         </div>
         <button className="flex items-center gap-3 px-8 py-3.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:bg-slate-900 hover:text-white transition-all italic">
           <Filter className="h-4 w-4" /> Filter Clusters
         </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 opacity-40" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic animate-pulse">Syncing Global Inventory Node...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="p-32 text-center bg-white border border-slate-100 rounded-[60px] shadow-sm">
           <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-inner border border-slate-100">
             <Home className="h-10 w-10 text-slate-200" />
           </div>
           <div>
             <h3 className="text-xl font-black text-slate-900 tracking-tight italic">No Asset Nodes Found</h3>
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 max-w-sm mx-auto italic">Initializing sectoral inventory will automatically populate this world-standard asset cluster.</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {properties.map((p) => (
            <div key={p.id} className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all group flex flex-col">
              <div className="h-64 bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-50">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="flex flex-col items-center gap-3 opacity-20">
                    <Building2 className="h-16 w-16 text-slate-400" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Asset Visualization Pending</p>
                  </div>
                )}
                {p.project && (
                    <div className="absolute top-6 left-6 px-4 py-2 bg-slate-900 text-white backdrop-blur shadow-2xl rounded-full text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 italic">
                        <Tags size={10} className="text-blue-400" /> Cluster: {p.project.name}
                    </div>
                )}
                <div className="absolute top-6 right-6 px-4 py-2 bg-white text-slate-900 shadow-2xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic border border-slate-100">FOR {p.status || 'SALE'}</div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><ArrowUpRight className="h-3 w-3" /></span>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] italic leading-none opacity-70">{p.type} Node</p>
                    </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tighter line-clamp-1 italic">{p.title}</h3>
                  <p className="text-[11px] text-slate-400 font-bold flex items-center gap-2 mt-2 italic"><MapPin className="h-3.5 w-3.5 text-rose-500" /> {p.location || p.address}</p>
                </div>
                <div className="flex items-center justify-between py-6 border-y border-slate-50">
                  <div className="flex flex-col items-center gap-1.5">
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">Inventory</p>
                      <div className="flex items-center gap-2 text-slate-900 font-black text-xs"><Bed className="h-4 w-4 text-blue-600" /> {p.beds || 0} BK</div>
                  </div>
                  <div className="w-[1px] h-8 bg-slate-50" />
                  <div className="flex flex-col items-center gap-1.5">
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">Ablution</p>
                      <div className="flex items-center gap-2 text-slate-900 font-black text-xs"><Bath className="h-4 w-4 text-emerald-600" /> {p.baths || 0} Unit</div>
                  </div>
                  <div className="w-[1px] h-8 bg-slate-50" />
                  <div className="flex flex-col items-center gap-1.5">
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">Magnitude</p>
                      <div className="flex items-center gap-2 text-slate-900 font-black text-xs"><Square className="h-4 w-4 text-amber-600" /> {p.area || 0} sqft</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-2xl font-black text-slate-900 tracking-tighter italic">₹{p.price.toLocaleString('en-IN')}</p>
                  <div className="flex gap-3">
                    <button 
                        onClick={() => {
                            setEditingProperty(p)
                            setFormData({ 
                                title: p.title, 
                                price: p.price.toString(), 
                                location: p.address || p.location || "", 
                                type: p.type, 
                                beds: (p.beds || "").toString(), 
                                baths: (p.baths || "").toString(), 
                                area: (p.area || "").toString(),
                                projectId: p.projectId || ""
                            })
                            setIsEditModalOpen(true)
                        }}
                        className="p-3.5 bg-white shadow-xl rounded-[18px] text-slate-400 hover:text-blue-600 border border-slate-100 transition-all active:scale-90"
                    >
                        <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-3.5 bg-white shadow-xl rounded-[18px] text-slate-400 hover:text-rose-600 border border-slate-100 transition-all active:scale-90"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Forge Modal (Add Unit) */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-6">
          <div className="bg-white rounded-[60px] p-12 w-full max-w-md shadow-2xl border border-slate-100 transform animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">{isEditModalOpen ? "Modify Asset" : "Forge Asset Node"}</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1 italic italic">Inventory Node Authorization Required</p>
              </div>
              <button onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }} className="p-3 hover:bg-slate-50 rounded-full transition-all text-slate-400"><X className="h-8 w-8" /></button>
            </div>
            <form onSubmit={isEditModalOpen ? handleEditSubmit : handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Target Cluster Mapping</label>
                <select 
                  required
                  className="w-full px-6 py-5 bg-slate-50/50 border border-slate-50 rounded-[28px] text-sm font-black focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none appearance-none cursor-pointer italic" 
                  value={formData.projectId} 
                  onChange={e => setFormData({...formData, projectId: e.target.value})}
                >
                  <option value="">Select Sector Cluster</option>
                  {projects.map(prj => (
                      <option key={prj.id} value={prj.id}>{prj.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Asset Architectural Category</label>
                <select className="w-full px-6 py-5 bg-slate-50/50 border border-slate-50 rounded-[28px] text-sm font-black focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none appearance-none cursor-pointer italic" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="APARTMENT">Apartment Unit</option>
                  <option value="HOUSE">Villa / House node</option>
                  <option value="LAND">Plotted Sector</option>
                  <option value="COMMERCIAL">Commercial Core</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Asset Signature (Title)</label>
                <input type="text" placeholder="e.g. Prestige Heights Phase II" required className="w-full px-6 py-5 bg-slate-50/50 border border-slate-50 rounded-[28px] text-sm font-black focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none placeholder:italic" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Asset Sector Region (Location)</label>
                <input type="text" placeholder="Dubai Hills, UAE" required className="w-full px-6 py-5 bg-slate-50/50 border border-slate-50 rounded-[28px] text-sm font-black focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none placeholder:italic" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>

              {formData.type !== "LAND" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic">Asset Sector Valuation (INR)</label>
                    <input type="number" placeholder="00.00" required className="w-full px-6 py-5 bg-slate-50/50 border border-slate-50 rounded-[28px] text-sm font-black focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none placeholder:italic" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic text-center block">Beds</label>
                        <input type="number" placeholder="3" className="w-full px-5 py-5 bg-slate-50/50 border border-slate-50 rounded-[24px] text-sm font-black outline-none text-center" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic text-center block">Baths</label>
                        <input type="number" step="0.5" placeholder="2.5" className="w-full px-5 py-5 bg-slate-50/50 border border-slate-50 rounded-[24px] text-sm font-black outline-none text-center" value={formData.baths} onChange={e => setFormData({...formData, baths: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1 italic text-center block">Area</label>
                        <input type="number" placeholder="2400" className="w-full px-5 py-5 bg-slate-50/50 border border-slate-50 rounded-[24px] text-sm font-black outline-none text-center" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }} className="flex-1 py-6 border border-slate-100 rounded-[32px] text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic hover:text-slate-900 transition-all">Abort</button>
                <button type="submit" className="flex-2 px-10 py-6 bg-slate-900 text-white rounded-[32px] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/10 hover:bg-blue-600 hover:scale-[1.02] active:scale-95 transition-all italic">
                  {isEditModalOpen ? "Sync Changes" : "Forge Asset Node"} ⚔️
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
