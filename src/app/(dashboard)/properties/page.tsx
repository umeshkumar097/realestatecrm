"use client"
import { useState, useEffect } from "react"
import { 
  Building2, Plus, Search, 
  MapPin, IndianRupee, Bed, 
  Bath, Square, ArrowUpRight,
  Filter, Home, Loader2, Edit3, Trash2
} from "lucide-react"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<any>(null)
  const [formData, setFormData] = useState({ title: "", price: "", location: "", type: "APARTMENT", beds: "", baths: "", area: "" })

  const loadProperties = async () => {
    try {
      const res = await fetch("/api/properties")
      if (res.ok) setProperties(await res.json())
    } catch (e) {} finally { setLoading(false) }
  }

  useEffect(() => { loadProperties() }, [])

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
        setFormData({ title: "", price: "", location: "", type: "APARTMENT", beds: "", baths: "", area: "" })
        loadProperties()
      } else {
        const errorData = await res.json()
        alert(errorData.error || "Failed to add project")
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
        setFormData({ title: "", price: "", location: "", type: "APARTMENT", beds: "", baths: "", area: "" })
        loadProperties()
      } else {
        const errorData = await res.json()
        alert(errorData.error || "Failed to update project")
      }
    } catch (e) { alert("Network error. Please try again.") }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property listing?")) return
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" })
      if (res.ok) loadProperties()
    } catch (e) { alert("Delete failed") }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight text-premium">Project Portfolio</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your agency's real estate projects and developments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-extrabold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
           <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      <div className="flex items-center gap-3 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
         <div className="flex-1 flex items-center gap-4 px-4 py-2 text-slate-400">
            <Search className="h-4 w-4" />
            <input type="text" placeholder="Search by location, title or project type..." className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 text-slate-800" />
         </div>
         <button className="flex items-center gap-2 px-4 py-2 border-l border-slate-100 text-sm font-bold text-slate-500 hover:text-primary transition-all">
           <Filter className="h-4 w-4" /> Filter
         </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : properties.length === 0 ? (
        <div className="p-20 text-center bg-white border border-slate-100 rounded-3xl">
           <Home className="h-12 w-12 mx-auto text-slate-200 mb-4" />
           <p className="text-slate-500 font-bold">No projects listed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group">
              <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <Building2 className="h-12 w-12 text-slate-200" />
                )}
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur shadow-lg rounded-full text-[10px] font-black uppercase text-primary">FOR {p.status || 'SALE'}</div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight line-clamp-1">{p.title}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {p.location || p.address}</p>
                </div>
                <div className="flex items-center justify-between py-4 border-y border-slate-50">
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs"><Bed className="h-3.5 w-3.5" /> {p.beds || 0}</div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs"><Bath className="h-3.5 w-3.5" /> {p.baths || 0}</div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs"><Square className="h-3.5 w-3.5" /> {p.area || 0} sqft</div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black text-slate-900">₹{p.price.toLocaleString('en-IN')}</p>
                  <div className="flex gap-2">
                    <button 
                        onClick={() => {
                            setEditingProperty(p)
                            setFormData({ title: p.title, price: p.price.toString(), location: p.address || p.location || "", type: p.type, beds: (p.beds || "").toString(), baths: (p.baths || "").toString(), area: (p.area || "").toString() })
                            setIsEditModalOpen(true)
                        }}
                        className="p-2 bg-slate-50 hover:bg-primary hover:text-white rounded-xl transition-all"
                    >
                        <Edit3 className="h-4 w-4" />
                    </button>
                    <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 bg-slate-50 hover:bg-red-500 hover:text-white rounded-xl transition-all"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Add New Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Project Category</label>
                <select className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="LAND">Land</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Project Name</label>
                <input type="text" placeholder="e.g. Royal Heights" required className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Exact Location</label>
                <input type="text" placeholder="Station Rd, Civil Lines" required className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>

              {formData.type !== "LAND" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Budget (INR)</label>
                    <input type="number" placeholder="Price" required className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
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
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border border-zinc-200 rounded-2xl font-black uppercase tracking-widest text-[10px] text-zinc-400">Cancel</button>
                <button type="submit" className="flex-2 px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Modify Project</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Project Category</label>
                <select className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="LAND">Land</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Project Name</label>
                <input type="text" placeholder="Title" required className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Exact Location</label>
                <input type="text" placeholder="Location" required className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-bold outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>

              {formData.type !== "LAND" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Budget (INR)</label>
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
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 border border-zinc-200 rounded-2xl font-black uppercase tracking-widest text-[10px] text-zinc-400">Cancel</button>
                <button type="submit" className="flex-2 px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
