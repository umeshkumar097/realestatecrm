import { useState, useEffect } from "react"
import { X, Save, Plus, Trash2, CheckCircle2 } from "lucide-react"

interface PlanModalProps {
    plan?: any
    onClose: () => void
    onSave: () => void
}

export default function PlanModal({ plan, onClose, onSave }: PlanModalProps) {
    const [formData, setFormData] = useState({
        name: plan?.name || "",
        description: plan?.description || "",
        monthlyPrice: plan?.monthlyPrice || 0,
        yearlyPrice: plan?.yearlyPrice || 0,
        maxAgents: plan?.maxAgents || 5,
        maxLeads: plan?.maxLeads || 1000,
        features: plan?.features || [],
        stripePriceId: plan?.stripePriceId || ""
    })
    const [newFeature, setNewFeature] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const method = plan?.id ? "PATCH" : "POST"
        const res = await fetch("/api/super-admin/plans", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(plan?.id ? { id: plan.id, ...formData } : formData)
        })
        if (res.ok) onSave()
    }

    const addFeature = () => {
        if (!newFeature) return
        setFormData({ ...formData, features: [...formData.features, newFeature] })
        setNewFeature("")
    }

    const removeFeature = (idx: number) => {
        setFormData({ ...formData, features: formData.features.filter((_: any, i: number) => i !== idx) })
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                    <div>
                        <h2 className="text-xl font-black tracking-tight italic">{plan?.id ? 'Edit Plan' : 'Create New Plan'}</h2>
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Define pricing and limits</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Plan Name</label>
                            <input required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Stripe Price ID</label>
                            <input
                                value={formData.stripePriceId}
                                onChange={e => setFormData({ ...formData, stripePriceId: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="price_..."
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Short Description</label>
                        <input required
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Price (Monthly)</label>
                            <input type="number" required
                                value={formData.monthlyPrice}
                                onChange={e => setFormData({ ...formData, monthlyPrice: parseFloat(e.target.value) })}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Price (Yearly)</label>
                            <input type="number" required
                                value={formData.yearlyPrice}
                                onChange={e => setFormData({ ...formData, yearlyPrice: parseFloat(e.target.value) })}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Max Agents</label>
                            <input type="number" required
                                value={formData.maxAgents}
                                onChange={e => setFormData({ ...formData, maxAgents: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Max Leads</label>
                            <input type="number" required
                                value={formData.maxLeads}
                                onChange={e => setFormData({ ...formData, maxLeads: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Included Services/Features</label>
                        <div className="flex gap-2">
                            <input 
                                value={newFeature}
                                onChange={e => setNewFeature(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                placeholder="Add a service (e.g. AI Support)"
                                className="flex-1 px-4 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-bold outline-none"
                            />
                            <button type="button" onClick={addFeature} className="p-2 bg-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all"><Plus size={20}/></button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.features.map((f: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200 group">
                                    <CheckCircle2 size={12} className="text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-tight text-zinc-700">{f}</span>
                                    <button type="button" onClick={() => removeFeature(i)} className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={12}/></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-zinc-100">
                        <button type="submit" className="flex-1 py-4 bg-primary text-white rounded-2xl font-black italic tracking-tight shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                            <Save size={18}/>
                            {plan?.id ? 'Update Package' : 'Publish Package'}
                        </button>
                        <button type="button" onClick={onClose} className="px-8 py-4 bg-zinc-100 text-zinc-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-all">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
