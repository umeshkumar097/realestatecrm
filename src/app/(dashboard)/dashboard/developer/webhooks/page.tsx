"use client"
import { useState, useEffect, useCallback } from "react"
import { 
  Zap, Globe, Key, 
  Trash2, Plus, Loader2, 
  ArrowLeft, ShieldCheck, List
} from "lucide-react"
import Link from "next/link"

export default function WebhookRegistryPage() {
    const [webhooks, setWebhooks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [whLoading, setWhLoading] = useState(false)

    const fetchWebhooks = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/webhooks/config")
            const data = await res.json()
            setWebhooks(data.webhooks || [])
        } catch (e) {
            console.error("Webhook fetch failed")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchWebhooks()
    }, [fetchWebhooks])

    const handleCreateWebhook = async () => {
        setWhLoading(true)
        try {
            await fetch("/api/webhooks/config", { method: "POST" })
            fetchWebhooks()
        } catch (e) {
            alert("Generation failed")
        } finally {
            setWhLoading(false)
        }
    }

    const handleDeleteWebhook = async (id: string) => {
        if (!confirm("Delete this webhook secret? It will immediately stop all incoming data for this channel.")) return
        setWhLoading(true)
        try {
            await fetch(`/api/webhooks/config?id=${id}`, { method: "DELETE" })
            fetchWebhooks()
        } catch (e) {
            alert("Deletion failed")
        } finally {
            setWhLoading(false)
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest leading-none">Synchronizing Registry...</p>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Header Cluster */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Webhook Registry</h1>
                    <p className="text-zinc-500 font-medium tracking-tight">Sync your real-time lead ingestion with global platform connectivity.</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Events Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[40px] p-8 shadow-sm">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
                            <div className="space-y-1">
                                <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Active Handlers</h2>
                                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest leading-none">Inbound Traffic Routing</p>
                            </div>
                            <button 
                                onClick={handleCreateWebhook}
                                disabled={whLoading}
                                className="px-6 py-3 bg-zinc-900 dark:bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/10 flex items-center gap-2"
                            >
                                {whLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                                Generate Webhook
                            </button>
                        </div>

                        {webhooks.length > 0 ? (
                            <div className="space-y-6">
                                {webhooks.map((wh) => (
                                    <div key={wh.id} className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-in slide-right duration-500">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl"><Globe size={20} className="text-primary"/></div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 dark:text-white leading-none mb-1">{wh.name || "Default Webhook"}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] font-black text-emerald-500 uppercase">Synced & Ready</span>
                                                        <span className="text-[9px] text-zinc-300 dark:text-zinc-600">•</span>
                                                        <span className="text-[9px] font-bold text-zinc-400">ID: {wh.id.slice(0, 8)}...</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteWebhook(wh.id)}
                                                className="p-3 bg-white dark:bg-zinc-900 border border-red-100 dark:border-red-900/30 text-red-500 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950 transition-all shadow-sm"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-5 pt-6 border-t border-zinc-200 dark:border-zinc-800/50">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-1.5"><Globe size={10}/> Endpoint URL</label>
                                                <div className="flex items-center gap-2">
                                                    <code className="flex-1 bg-white dark:bg-zinc-900 px-5 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400 truncate tracking-tight font-mono">
                                                        https://propgocrm.com/api/webhooks/incoming/{wh.agencyId}
                                                    </code>
                                                    <button onClick={() => { navigator.clipboard.writeText(`https://propgocrm.com/api/webhooks/incoming/${wh.agencyId}`); alert("URL Copied!"); }} className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:text-primary transition-all font-black text-[10px] uppercase">Copy</button>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-1.5"><Key size={10}/> x-webhook-secret Header</label>
                                                <div className="flex items-center gap-2">
                                                    <code className="flex-1 bg-white dark:bg-zinc-900 px-5 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-400 truncate tracking-tight font-mono">
                                                        {wh.secret}
                                                    </code>
                                                    <button onClick={() => { navigator.clipboard.writeText(wh.secret); alert("Secret Copied!"); }} className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:text-primary transition-all font-black text-[10px] uppercase">Copy</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center gap-6 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[32px]">
                                <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-[32px] flex items-center justify-center">
                                    <Zap size={32} className="text-zinc-200 dark:text-zinc-600" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-black text-slate-800 dark:text-zinc-200 tracking-tight">Registry Empty</h3>
                                    <p className="text-xs text-zinc-400 font-medium max-w-xs mx-auto italic">Generate your first webhook to begin ingestion from your external platforms (FB Ads, Custom Forms, etc).</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Integration Guide / Tip Col */}
                <div className="space-y-8">
                    <div className="bg-zinc-900 text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] -z-10 group-hover:bg-primary/30 transition-all duration-700" />
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-white/10 rounded-2xl"><List size={20}/></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Protocol Tips</span>
                        </div>
                        <ul className="space-y-5">
                            {[
                                "Send data as JSON POST",
                                "Include 'phone' as priority",
                                "Use the 'secret' header",
                                "Auto-deduplication active"
                            ].map((tip) => (
                                <li key={tip} className="flex items-center gap-3 text-xs font-bold text-zinc-400 group/item">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full group-hover/item:scale-150 transition-transform" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Usage Plan</p>
                            <p className="text-sm font-black text-emerald-500 italic underline decoration-dotted underline-offset-4 decoration-emerald-500/30">Free & Unlimited</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[40px] p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={20} className="text-primary"/>
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Global Security</h3>
                        </div>
                        <p className="text-[10px] font-medium text-zinc-500 leading-relaxed italic">
                            Webhooks are strictly filtered by your unique Agency ID and verified via the 'x-webhook-secret' header protocol.
                        </p>
                        <Link href="/dashboard/developer/api" className="block w-full py-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl text-center text-[10px] font-black uppercase tracking-widest hover:text-primary transition-all">
                            Switch to API Keys
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
