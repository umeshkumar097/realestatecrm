"use client"

import { useState } from "react"
import { X, Loader2, CheckCircle2, MessageSquare, Phone, Mail, Building2 } from "lucide-react"

export default function LeadModal({ isOpen, onClose, plan }: { isOpen: boolean, onClose: () => void, plan: string }) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: ""
    })

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch("/api/platform/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, plan })
            })
            if (res.ok) setSuccess(true)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tighter">Enterprise Inquiry</h2>
                    <p className="text-blue-100 text-sm font-medium mt-1">Scale your property empire with custom solutions.</p>
                </div>

                <div className="p-8 overflow-y-auto">
                    {success ? (
                        <div className="text-center py-10 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Request Received!</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">Thank you, {formData.name}. Our expert team will contact you within 24 hours.</p>
                            <button onClick={onClose} className="mt-8 px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all">Close</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                                    <input required placeholder="John Doe" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone Number</label>
                                    <input required placeholder="+91 99999 99999" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Work Email</label>
                                <input required type="email" placeholder="john@company.com" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Company Name</label>
                                <input required placeholder="Skyline Realty" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Custom Requirements</label>
                                <textarea rows={3} placeholder="How many agents? Multiple branches?" className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold text-sm resize-none" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                            </div>
                            
                            <button disabled={loading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm mt-2">
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Request Custom Quote"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
