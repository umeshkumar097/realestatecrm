"use client"

import { useState, useEffect } from "react"
import { 
  Plus, Edit2, Trash2, Shield, 
  Users, Layers, IndianRupee,
  Loader2, X, PlusCircle, Check
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const [newFeature, setNewFeature] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    monthlyPrice: "",
    yearlyPrice: "",
    maxAgents: "5",
    maxLeads: "1000",
    features: [] as string[]
  })

  const loadPlans = async () => {
    try {
      const res = await fetch("/api/super-admin/plans")
      if (res.ok) setPlans(await res.json())
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  useEffect(() => { loadPlans() }, [])

  const handleEdit = (plan: any) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description || "",
      monthlyPrice: plan.monthlyPrice.toString(),
      yearlyPrice: plan.yearlyPrice.toString(),
      maxAgents: plan.maxAgents.toString(),
      maxLeads: plan.maxLeads.toString(),
      features: plan.features || []
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? Standard packages shouldn't be deleted if agencies are using them.")) return
    try {
      const res = await fetch(`/api/super-admin/plans/${id}`, { method: "DELETE" })
      if (res.ok) loadPlans()
      else {
          const err = await res.json()
          alert(err.error)
      }
    } catch (e) { alert("Delete failed") }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingPlan ? `/api/super-admin/plans/${editingPlan.id}` : "/api/super-admin/plans"
    const method = editingPlan ? "PATCH" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setIsModalOpen(false)
        setEditingPlan(null)
        setFormData({ name: "", description: "", monthlyPrice: "", yearlyPrice: "", maxAgents: "5", maxLeads: "1000", features: [] })
        loadPlans()
      }
    } catch (e) { alert("Operation failed") }
  }

  const addFeature = () => {
    if (!newFeature.trim()) return
    setFormData({ ...formData, features: [...formData.features, newFeature.trim()] })
    setNewFeature("")
  }

  const removeFeature = (idx: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== idx) })
  }

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Subscription Packages</h1>
          <p className="text-zinc-500 text-sm">Define and manage plans available for agencies.</p>
        </div>
        <button 
          onClick={() => { setEditingPlan(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" /> Create New Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                <Shield className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleEdit(plan)} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(plan.id)} className="p-2 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-black text-zinc-900 mb-1">{plan.name}</h3>
            <p className="text-sm text-zinc-500 mb-6 line-clamp-2">{plan.description || "No description provided."}</p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between py-3 border-b border-zinc-50">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <IndianRupee className="h-3 w-3" /> Monthly
                </span>
                <span className="text-lg font-black text-zinc-900">₹{plan.monthlyPrice}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-zinc-50">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Users className="h-3 w-3" /> Max Agents
                </span>
                <span className="text-lg font-black text-zinc-900">{plan.maxAgents}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-zinc-50">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Layers className="h-3 w-3" /> Max Leads
                </span>
                <span className="text-lg font-black text-zinc-900">{plan.maxLeads}</span>
              </div>
            </div>

            <div className="space-y-2 mb-8 flex-1">
               <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Included Features</p>
               {plan.features?.map((f: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-bold text-zinc-600">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    {f}
                  </div>
               ))}
            </div>

            <button className="w-full py-4 rounded-2xl bg-zinc-50 text-zinc-400 text-xs font-black uppercase tracking-widest group-hover:bg-primary/5 group-hover:text-primary transition-all">
                Plan Overview
            </button>
          </div>
        ))}

        {plans.length === 0 && (
          <div className="col-span-full py-20 text-center bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200">
            <Shield className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
            <h3 className="text-xl font-black text-zinc-800">No packages created yet</h3>
            <p className="text-zinc-500 max-w-xs mx-auto mt-2">Start by creating your first subscription package to monetize your platform.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="px-10 py-8 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-black tracking-tight">{editingPlan ? "Edit Package" : "New Package"}</h2>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Configure subscription parameters</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-3 hover:bg-zinc-50 rounded-2xl border border-zinc-200 transition-all bg-white"
              >
                <X className="h-6 w-6 text-zinc-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Package Name</label>
                  <input required
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                    placeholder="e.g. Professional"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Description</label>
                  <input
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                    placeholder="Brief overview of the plan"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Monthly Cost (₹)</label>
                  <input type="number" required
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                    value={formData.monthlyPrice}
                    onChange={(e) => setFormData({...formData, monthlyPrice: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Yearly Cost (₹)</label>
                  <input type="number" required
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                    value={formData.yearlyPrice}
                    onChange={(e) => setFormData({...formData, yearlyPrice: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Agent Limit</label>
                  <input type="number" required
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                    value={formData.maxAgents}
                    onChange={(e) => setFormData({...formData, maxAgents: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Lead Limit</label>
                  <input type="number" required
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                    value={formData.maxLeads}
                    onChange={(e) => setFormData({...formData, maxLeads: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Key Features</label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
                    placeholder="Add a feature..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button type="button" onClick={addFeature} className="px-6 py-4 bg-zinc-900 text-white rounded-2xl font-black shadow-lg">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, idx) => (
                    <div key={idx} className="px-4 py-2 bg-zinc-100 border border-zinc-200 rounded-xl flex items-center gap-3 text-sm font-bold text-zinc-600 animate-in fade-in zoom-in-95">
                      {feature}
                      <button type="button" onClick={() => removeFeature(idx)} className="text-zinc-400 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-zinc-100 text-zinc-600 rounded-[24px] font-black text-sm hover:bg-zinc-200 transition-all uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-1 py-5 bg-primary text-white rounded-[24px] font-black text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest">
                  {editingPlan ? "Save Package Changes" : "Deploy New Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
