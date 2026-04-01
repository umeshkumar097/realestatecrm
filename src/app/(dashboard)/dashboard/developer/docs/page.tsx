"use client"
import { useState } from "react"
import { 
  BookOpen, Terminal, Code, 
  Zap, Key, Globe, 
  Copy, Check, ChevronRight,
  Info, AlertTriangle, ShieldCheck
} from "lucide-react"

const languages = [
  { id: "curl", name: "cURL", icon: Terminal },
  { id: "node", name: "Node.js", icon: Code },
  { id: "python", name: "Python", icon: Zap },
  { id: "php", name: "PHP", icon: Globe }
]

export default function ApiDocsPage() {
    const [selectedLang, setSelectedLang] = useState("curl")
    const [copied, setCopied] = useState<string | null>(null)

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const samples = {
        auth: {
            curl: `curl -X GET "https://propgocrm.com/api/leads" \\
  -H "x-api-key: YOUR_API_KEY"`,
            node: `const response = await fetch("https://propgocrm.com/api/leads", {
  headers: {
    "x-api-key": "YOUR_API_KEY"
  }
});
const data = await response.json();`,
            python: `import requests

url = "https://propgocrm.com/api/leads"
headers = {"x-api-key": "YOUR_API_KEY"}

response = requests.get(url, headers=headers)
print(response.json())`,
            php: `<?php
$ch = curl_init("https://propgocrm.com/api/leads");
curl_setopt($ch, CURLOPT_HTTPHEADER, array("x-api-key: YOUR_API_KEY"));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`
        },
        webhook: {
            curl: `curl -X POST "https://propgocrm.com/api/webhooks/incoming/AGENCY_ID" \\
  -H "x-webhook-secret: YOUR_WEBHOOK_SECRET" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "phone": "+919876543210",
    "email": "john@example.com",
    "notes": "Interested in 3BHK"
  }'`,
            node: `await fetch("https://propgocrm.com/api/webhooks/incoming/AGENCY_ID", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-webhook-secret": "YOUR_WEBHOOK_SECRET"
  },
  body: JSON.stringify({
    name: "John Doe",
    phone: "+919876543210",
    email: "john@example.com"
  })
});`,
            python: `import requests

url = "https://propgocrm.com/api/webhooks/incoming/AGENCY_ID"
headers = {
    "x-webhook-secret": "YOUR_WEBHOOK_SECRET",
    "Content-Type": "application/json"
}
payload = {
    "name": "John Doe",
    "phone": "+919876543210"
}

response = requests.post(url, json=payload, headers=headers)`,
            php: `<?php
$data = array("name" => "John Doe", "phone" => "+919876543210");
$options = array(
    'http' => array(
        'header'  => "Content-Type: application/json\\r\\n" .
                     "x-webhook-secret: YOUR_WEBHOOK_SECRET\\r\\n",
        'method'  => 'POST',
        'content' => json_encode($data)
    )
);
$context  = stream_context_create($options);
$result = file_get_contents("https://propgocrm.com/api/webhooks/incoming/AGENCY_ID", false, $context);
?>`
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            {/* Header Cluster */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                        <BookOpen size={14}/>
                        Developer Reference v1.2
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">PropGoCRM API Blueprint</h1>
                    <p className="text-zinc-500 font-medium tracking-tight">Accelerate your real estate workflows with professional-grade API connectivity.</p>
                </div>
                
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
                    {languages.map((lang) => {
                        const Icon = lang.icon
                        return (
                            <button
                                key={lang.id}
                                onClick={() => setSelectedLang(lang.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                    selectedLang === lang.id 
                                    ? "bg-white dark:bg-zinc-950 text-primary shadow-sm" 
                                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                                }`}
                            >
                                <Icon size={14}/>
                                {lang.name}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Scrollable Nav */}
                <div className="lg:col-span-1 space-y-8 sticky top-24 h-fit">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Chapters</p>
                        <nav className="space-y-1">
                            {[
                                { id: "#auth", name: "Authentication", icon: Key },
                                { id: "#webhooks", name: "Lead Ingestion", icon: Zap },
                                { id: "#leads", name: "Leads Registry", icon: List },
                                { id: "#security", name: "Best Practices", icon: ShieldCheck }
                            ].map((item) => (
                                <a 
                                    key={item.id}
                                    href={item.id}
                                    className="flex items-center justify-between group px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={16} className="text-zinc-400 group-hover:text-primary transition-colors" />
                                        <span className="text-sm font-black text-slate-700 dark:text-zinc-300 group-hover:text-slate-900">{item.name}</span>
                                    </div>
                                    <ChevronRight size={14} className="text-zinc-300 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                                </a>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl">
                        <Info size={20} className="text-primary mb-3" />
                        <p className="text-[10px] font-bold text-slate-600 dark:text-zinc-400 leading-relaxed uppercase tracking-wider">
                            Real-time sync handles deduplication by phone number automatically across all endpoints.
                        </p>
                    </div>
                </div>

                {/* Main Docs Content */}
                <div className="lg:col-span-3 space-y-20">
                    
                    {/* Authentication Section */}
                    <section id="auth" className="scroll-mt-32 space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">01. Authentication Protocol</h2>
                            <p className="text-zinc-500 font-medium">Provision your request headers with identity-verification keys to authorize platform access.</p>
                        </div>
                        
                        <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-[32px] flex items-start gap-4">
                            <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={24} />
                            <div className="space-y-1">
                                <h4 className="font-black text-amber-900 dark:text-amber-400 text-sm">Security Mandate</h4>
                                <p className="text-xs text-amber-800 dark:text-amber-500/80 font-medium leading-relaxed italic">
                                    API Keys are strictly for server-to-server communication. Never expose your keys in frontend codebases (React, Vue, etc.) as they can be extracted by malicious actors.
                                </p>
                            </div>
                        </div>

                        <div className="bg-zinc-950 rounded-[32px] p-8 shadow-2xl relative group overflow-hidden border border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                    <span className="text-[10px] font-black uppercase transition-widest text-zinc-500">{selectedLang} Reference</span>
                                </div>
                                <button 
                                    onClick={() => handleCopy((samples.auth as any)[selectedLang], "auth")}
                                    className="p-2 text-zinc-500 hover:text-white transition-all bg-white/5 rounded-xl border border-white/10"
                                >
                                    {copied === "auth" ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                </button>
                            </div>
                            <pre className="text-sm font-mono text-zinc-300 overflow-x-auto selection:bg-primary/30">
                                <code>{(samples.auth as any)[selectedLang]}</code>
                            </pre>
                        </div>
                    </section>

                    {/* Webhook Ingestion */}
                    <section id="webhooks" className="scroll-mt-32 space-y-8">
                        <div className="space-y-2">
                             <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">02. Inbound Lead Ingestion</h2>
                             <p className="text-zinc-500 font-medium">Sync leads from Facebook Ads, Google Forms, or your custom CRM via high-speed Webhook Handlers.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl space-y-2 shadow-sm">
                                <span className="text-[9px] font-black uppercase text-primary tracking-widest">Header Required</span>
                                <p className="text-sm font-black text-slate-800 dark:text-zinc-200">x-webhook-secret</p>
                                <p className="text-[10px] font-bold text-zinc-400 leading-relaxed uppercase">Found in your Webhook Registry</p>
                            </div>
                            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl space-y-2 shadow-sm">
                                <span className="text-[9px] font-black uppercase text-primary tracking-widest">Method</span>
                                <p className="text-sm font-black text-slate-800 dark:text-zinc-200">POST / JSON</p>
                                <p className="text-[10px] font-bold text-zinc-400 leading-relaxed uppercase">Send data as raw JSON Body</p>
                            </div>
                        </div>

                        <div className="bg-zinc-950 rounded-[32px] p-8 shadow-2xl relative group overflow-hidden border border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black uppercase transition-widest text-zinc-500">{selectedLang} Payload</span>
                                </div>
                                <button 
                                    onClick={() => handleCopy((samples.webhook as any)[selectedLang], "webhook")}
                                    className="p-2 text-zinc-500 hover:text-white transition-all bg-white/5 rounded-xl border border-white/10"
                                >
                                    {copied === "webhook" ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                </button>
                            </div>
                            <pre className="text-sm font-mono text-zinc-300 overflow-x-auto selection:bg-primary/30">
                                <code>{(samples.webhook as any)[selectedLang]}</code>
                            </pre>
                        </div>
                    </section>

                    {/* Footer Guide Footer */}
                    <div className="pt-20 border-t border-zinc-100 dark:border-zinc-800 text-center space-y-4">
                        <Terminal className="mx-auto text-zinc-200 dark:text-zinc-800" size={64}/>
                        <div className="space-y-1">
                            <h3 className="font-black text-slate-900 dark:text-white tracking-tight">Need technical assistance?</h3>
                            <p className="text-xs text-zinc-500 font-medium">Our engineering team is ready to help you build custom integrations.</p>
                        </div>
                        <Link 
                            href="/dashboard/support"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-zinc-900/10 dark:shadow-none"
                        >
                            Open Engineering Ticket
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}

function List(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  )
}
