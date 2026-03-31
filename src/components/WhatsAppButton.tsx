"use client"

import { useState } from "react"
import { MessageSquare, X, Send, User, Building, Zap, ArrowRight, CheckCircle2 } from "lucide-react"

export default function WhatsAppButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [form, setForm] = useState({ name: "", agency: "", interest: "Portal Sync Automation" })
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("submitting")
        
        // Construct WhatsApp message
        const message = `*PropGoCRM New Inquiry* \n\n*Name:* ${form.name}\n*Agency:* ${form.agency}\n*Interest:* ${form.interest}\n\n_Sent via PropGoCRM Website_`
        const waUrl = `https://wa.me/918449488090?text=${encodeURIComponent(message)}`

        setTimeout(() => {
            setStatus("success")
            window.open(waUrl, "_blank")
            setTimeout(() => {
                setIsOpen(false)
                setStatus("idle")
            }, 1000)
        }, 800)
    }

    return (
        <>
            {/* FLOATING BUTTON */}
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-[100] group flex items-center gap-3 p-2 pr-6 bg-white rounded-full shadow-2xl border border-zinc-100 hover:scale-105 active:scale-95 transition-all duration-300"
            >
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center animate-pulse group-hover:animate-none">
                    <MessageSquare size={24} />
                </div>
                <div className="text-left">
                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest leading-none mb-1">WhatsApp Sales</p>
                    <p className="text-sm font-black text-zinc-900 italic leading-none">Inquire Now</p>
                </div>
            </button>

            {/* MODAL OVERLAY */}
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden relative animate-in zoom-in slide-in-from-bottom-8 duration-500">
                        
                        {/* Header */}
                        <div className="p-8 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black italic tracking-tighter text-zinc-900">Start Conversation</h3>
                                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-1">Direct to Specialist (+91 8449488090)</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
                                <X size={20} className="text-zinc-400" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 flex items-center gap-2">
                                    <User size={10} /> Full Name
                                </label>
                                <input 
                                    required 
                                    value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold placeholder:text-zinc-300" 
                                    placeholder="Your Name" 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 flex items-center gap-2">
                                    <Building size={10} /> Agency Name
                                </label>
                                <input 
                                    required 
                                    value={form.agency}
                                    onChange={e => setForm({...form, agency: e.target.value})}
                                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold placeholder:text-zinc-300" 
                                    placeholder="Estate Firm Name" 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4 flex items-center gap-2">
                                    <Zap size={10} /> Interest Area
                                </label>
                                <select 
                                    value={form.interest}
                                    onChange={e => setForm({...form, interest: e.target.value})}
                                    className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-zinc-700 appearance-none"
                                >
                                    <option>Portal Sync Automation</option>
                                    <option>WhatsApp CRM Setup</option>
                                    <option>Enterprise Multi-Branch</option>
                                    <option>Aiclex Custom Setup</option>
                                </select>
                            </div>

                            <button 
                                type="submit" 
                                disabled={status !== "idle"}
                                className={`w-full py-5 rounded-[24px] font-black text-xl italic tracking-tight transition-all flex items-center justify-center gap-3 shadow-xl ${status === "success" ? "bg-emerald-500 text-white" : "bg-zinc-900 text-white hover:bg-emerald-600 shadow-zinc-200"}`}
                            >
                                {status === "idle" && <><Send size={20} /> Open WhatsApp</>}
                                {status === "submitting" && "Redirecting..."}
                                {status === "success" && <><CheckCircle2 size={24} /> Sent!</>}
                            </button>

                            <p className="text-center text-[9px] font-black uppercase text-zinc-400 tracking-[0.3em]">Official Business Verified: +91 8449488090</p>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
