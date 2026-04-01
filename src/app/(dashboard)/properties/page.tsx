"use client"
import { useState, useEffect } from "react"
import { 
  Building2, Plus, Search, 
  MapPin, IndianRupee, Bed, 
  Bath, Square, ArrowUpRight,
  Filter, Home, Loader2, Edit3, Trash2,
  Box, Tags
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Box className="h-6 w-6 text-primary" />
            Inventory & Units
          </h1>
          <p className="text-slate-500 text-sm font-medium ml-1">Manage individual plots, flats, and listings within your projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-extrabold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
           <Plus className="h-4 w-4" /> Add Unit / Plot
        </button>
      </div>

      <div className="flex items-center gap-3 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
         <div className="flex-1 flex items-center gap-4 px-4 py-2 text-slate-400 group">
            <Search className="h-4 w-4 group-focus-within:text-primary transition-colors" />
            <input type="text" placeholder="Search by location, unit title or project mapping..." className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-slate-400 text-slate-800" />
         </div>
         <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-zinc-100 transition-all">
           <Filter className="h-4 w-4" /> Filter Units
         </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Inventory...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="p-20 text-center bg-white border border-slate-100 rounded-[40px] space-y-4">
           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
             <Home className="h-8 w-8 text-slate-200" />
           </div>
           <div>
             <p className="text-slate-800 font-black">No inventory units listed yet.</p>
             <p className="text-slate-400 text-xs font-medium">Add your first plot or flat to start assigning them to projects.</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div key={p.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group">
              <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <Building2 className="h-12 w-12 text-slate-200" />
                )}
                {p.project && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary/90 text-white backdrop-blur shadow-lg rounded-full text-[9px] font-black uppercase tracking-tight flex items-center gap-1">
                        <Tags size={10} /> {p.project.name}
                    </div>
                )}
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur shadow-lg rounded-full text-[10px] font-black uppercase text-primary">FOR {p.status || 'SALE'}</div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1"><MapPin className="h-3 w-3 text-rose-500" /> {p.location || p.address}</p>
                </div>
                <div className="flex items-center justify-between py-4 border-y border-slate-50">
                  <div className="flex items-center gap-1.5 text-slate-500 font-black text-xs"><Bed className="h-3.5 w-3.5" /> {p.beds || 0}</div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-black text-xs"><Bath className="h-3.5 w-3.5" /> {p.baths || 0}</div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-black text-xs"><Square className="h-3.5 w-3.5" /> {p.area || 0} sqft</div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black text-slate-900 tracking-tighter">₹{p.price.toLocaleString('en-IN')}</p>
                  <div className="flex gap-2">
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
                        className="p-2.5 bg-slate-50 hover:bg-primary hover:text-white rounded-xl transition-all"
                    >
                        <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2.5 bg-slate-50 hover:bg-red-500 hover:text-white rounded-xl transition-all"
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

      {/* Primary Modal (Add Unit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsModalOpen(false)} />
          
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Add New Unit / Plot</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Parent Project Mapping</label>
                <select 
                  required
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" 
                  value={formData.projectId} 
                  onChange={e => setFormData({...formData, projectId: e.target.value})}
                >
                  <option value="">Select Target Project</option>
                  {projects.map(prj => (
                      <option key={prj.id} value={prj.id}>{prj.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Unit Category</label>
                <select className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="LAND">Land</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Unit Title / Plot Number</label>
                <input type="text" placeholder="e.g. Apartment 402 or Plot #12" required className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Unit Specific Location</label>
                <input type="text" placeholder="e.g. West Wing, 4th Floor" required className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>

              {formData.type !== "LAND" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Unit Valuation (INR)</label>
                    <input type="number" placeholder="Total Price" required className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Beds</label>
                        <input type="number" placeholder="0" className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Baths</label>
                        <input type="number" step="0.5" placeholder="0" className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none" value={formData.baths} onChange={e => setFormData({...formData, baths: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Area</label>
                        <input type="number" placeholder="Sqft" className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border border-zinc-200 rounded-2xl font-black uppercase tracking-widest text-[10px] text-zinc-300">Discard</button>
                <button type="submit" className="flex-2 px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Confirm Unit Addition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsEditModalOpen(false)} />

          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Modify Inventory Unit</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Project Mapping</label>
                <select 
                  required
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none" 
                  value={formData.projectId} 
                  onChange={e => setFormData({...formData, projectId: e.target.value})}
                >
                  <option value="">Select Project</option>
                  {projects.map(prj => (
                      <option key={prj.id} value={prj.id}>{prj.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Unit Category</label>
                <select className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="LAND">Land</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Unit Title</label>
                <input type="text" placeholder="Title" required className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Location</label>
                <input type="text" placeholder="Location" required className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>

              {formData.type !== "LAND" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Valuation (INR)</label>
                    <input type="number" placeholder="Price" required className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <input type="number" placeholder="Beds" className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} />
                    <input type="number" step="0.5" placeholder="Baths" className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none" value={formData.baths} onChange={e => setFormData({...formData, baths: e.target.value})} />
                    <input type="number" placeholder="Sqft" className="w-full px-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 border border-zinc-200 rounded-2xl font-black uppercase tracking-widest text-[10px] text-zinc-300">Cancel</button>
                <button type="submit" className="flex-2 px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Save Inventory Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
