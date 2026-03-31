"use client"
import { useState, useEffect } from "react"
import InnerPageLayout from "@/components/inner-page-layout"
import { 
    Webhook, Sheet, Link2, Copy, CheckCircle2, 
    RefreshCcw, ExternalLink, Globe, Zap, Mail,
    MessageSquare, Building2, LayoutGrid, Loader2
} from "lucide-react"
import { toast } from "react-hot-toast"
import { useSession } from "next-auth/react"

export default function IntegrationsPage() {
    const { data: session } = useSession()
    const [loading, setLoading] = useState(true)
    const [webhook, setWebhook] = useState<any>(null)
    const [googleSync, setGoogleSync] = useState<any>(null)

    const [origin, setOrigin] = useState("")

    useEffect(() => {
        if (typeof window !== "undefined") {
            setOrigin(window.location.origin)
        }
    }, [])

    const fetchIntegrations = async () => {
        try {
            const [webRes, googleRes] = await Promise.all([
                fetch("/api/integrations/webhook"),
                fetch("/api/integrations/google-sheets/config")
            ])
            if (webRes.ok) {
                const data = await webRes.json()
                setWebhook(data.config)
            }
            if (googleRes.ok) {
                const data = await googleRes.json()
                setGoogleSync(data.config)
            }
        } catch (error) {
            console.error("Failed to fetch integrations", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (session?.user?.agencyId) fetchIntegrations()
    }, [session])

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied to clipboard`)
    }

    const generateWebhook = async () => {
        setLoading(true)
        const res = await fetch("/api/integrations/webhook", { method: "POST" })
        if (res.ok) fetchIntegrations()
        setLoading(false)
    }

    const webhookUrl = `${origin}/api/webhooks/incoming/${session?.user?.agencyId}?secret=${webhook?.secret}`

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    )

    return (
        <InnerPageLayout 
            badge="Ecosystem"
            title="Integrations"
            subtitle="Connect PropGOCrm with the tools you already use every day."
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* INCOMING WEBHOOKS */}
                <div className="bg-white rounded-[40px] border border-zinc-200 p-8 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-blue-50 rounded-[20px] flex items-center justify-center">
                            <Webhook className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black italic tracking-tight">Incoming Webhooks</h2>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Connect Pabbly, Zapier, WebFlow</p>
                        </div>
                    </div>

                    {!webhook ? (
                        <div className="bg-zinc-50 rounded-3xl p-10 text-center border-2 border-dashed border-zinc-200">
                            <p className="text-zinc-500 text-sm font-bold mb-6">Receive real-time lead data from any external source.</p>
                            <button 
                                onClick={generateWebhook}
                                className="bg-primary text-white px-8 py-3 rounded-2xl font-black italic tracking-tight hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                            >
                                Generate Webhook URL
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Your Webhook URL</label>
                                <div className="flex items-center gap-2 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 font-bold group/input">
                                    <input 
                                        readOnly 
                                        value={webhookUrl} 
                                        className="flex-1 bg-transparent text-xs outline-none text-zinc-600 truncate"
                                    />
                                    <button 
                                        onClick={() => copyToClipboard(webhookUrl, "Webhook URL")}
                                        className="p-2 hover:bg-white rounded-xl transition-all text-zinc-400 hover:text-primary"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                        <CheckCircle2 size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
                                    </div>
                                    <p className="text-xs font-black text-emerald-700 italic">Active & Ready</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                                        <Zap size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Protocol</span>
                                    </div>
                                    <p className="text-xs font-black text-blue-700 italic">JSON Post</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-100">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Expected JSON Format</p>
                                <code className="block p-4 bg-zinc-900 text-zinc-400 rounded-2xl text-[10px] font-mono leading-relaxed">
                                    &#123;<br/>
                                    &nbsp;&nbsp;"name": "John Doe",<br/>
                                    &nbsp;&nbsp;"phone": "+971501234567",<br/>
                                    &nbsp;&nbsp;"email": "john@example.com",<br/>
                                    &nbsp;&nbsp;"budget": "1,000,000 AED"<br/>
                                    &#125;
                                </code>
                            </div>
                        </div>
                    )}
                </div>

                {/* GOOGLE SHEETS */}
                <div className="bg-white rounded-[40px] border border-zinc-200 p-8 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-emerald-50 rounded-[20px] flex items-center justify-center">
                            <Sheet className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black italic tracking-tight">Google Sheets Sync</h2>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Two-way real-time spreadsheet sync</p>
                        </div>
                    </div>

                    {!googleSync?.spreadsheetId ? (
                        <div className="bg-zinc-50 rounded-3xl p-10 text-center border-2 border-dashed border-zinc-200">
                            <p className="text-zinc-500 text-sm font-bold mb-6">Automatically export leads to a Google Sheet in real-time.</p>
                            <button 
                                onClick={() => window.location.href = "/api/integrations/google/auth"}
                                className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black italic tracking-tight hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-100"
                            >
                                Connect Google Account
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-200 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Connected Spreadsheet</p>
                                        <h3 className="text-sm font-black italic text-zinc-800">PropGOCrm Leads Sync</h3>
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        Synced
                                    </div>
                                </div>
                                <a 
                                    href={`https://docs.google.com/spreadsheets/d/${googleSync.spreadsheetId}`}
                                    target="_blank"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:bg-zinc-50 transition-colors"
                                >
                                    <ExternalLink size={14} />
                                    Open Spreadsheet
                                </a>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
                                    <span className="flex items-center gap-2"><RefreshCcw size={14} /> Last Synced</span>
                                    <span className="font-black italic text-zinc-900">{googleSync.lastSyncedAt ? new Date(googleSync.lastSyncedAt).toLocaleString() : 'Never'}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
                                    <span className="flex items-center gap-2"><LayoutGrid size={14} /> Sync Status</span>
                                    <span className="font-black italic text-primary">Real-time Enabled</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => window.location.href = "/api/integrations/google/auth"}
                                className="w-full py-4 text-zinc-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors"
                            >
                                Disconnect and Re-authenticate
                            </button>
                        </div>
                    )}
                </div>

                {/* OTHER PORTALS */}
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    {[
                        { name: "Magicbricks", icon: <Building2 />, color: "text-red-600" },
                        { name: "99acres", icon: <Globe />, color: "text-blue-600" },
                        { name: "Property Finder", icon: <LayoutGrid />, color: "text-red-500" },
                        { name: "Bayut", icon: <Building2 />, color: "text-emerald-600" }
                    ].map(portal => (
                        <div key={portal.name} className="p-6 bg-white border border-zinc-200 rounded-[32px] hover:border-primary/20 transition-all group flex flex-col items-center text-center">
                            <div className={`w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${portal.color}`}>
                                {portal.icon}
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-800">{portal.name}</h3>
                            <p className="text-[8px] font-bold text-zinc-400 mt-1 uppercase">Portal API</p>
                        </div>
                    ))}
                </div>
            </div>
        </InnerPageLayout>
    )
}
