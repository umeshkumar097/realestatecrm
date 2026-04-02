import InnerPageLayout from "@/components/inner-page-layout"
import { Code2, Key, Zap, Globe, Lock, Book } from "lucide-react"

const endpoints = [
  { method: "GET", path: "/api/leads", desc: "List all leads for your agency (paginated, filterable)" },
  { method: "POST", path: "/api/leads", desc: "Create a new lead with full contact and property details" },
  { method: "GET", path: "/api/leads/:id", desc: "Fetch a single lead by ID with full history" },
  { method: "PUT", path: "/api/leads/:id", desc: "Update lead status, assigned agent, or details" },
  { method: "DELETE", path: "/api/leads/:id", desc: "Archive a lead (soft delete, recoverable)" },
  { method: "GET", path: "/api/properties", desc: "List all property listings with filters" },
  { method: "POST", path: "/api/properties", desc: "Create a new property listing" },
  { method: "GET", path: "/api/agents", desc: "List all agents in your agency" },
  { method: "GET", path: "/api/analytics/summary", desc: "Get revenue, leads, and conversion summary" },
  { method: "POST", path: "/api/webhooks", desc: "Register a webhook endpoint for real-time events" },
]

const methodColors: Record<string, string> = {
  GET: "bg-emerald-100 text-emerald-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-amber-100 text-amber-700",
  DELETE: "bg-red-100 text-red-700",
}

export default function ApiDocsPage() {
  return (
    <InnerPageLayout
      badge="API Docs"
      title="Master Matrix Architecture API v2"
      subtitle="Build on top of Master Matrix Architecture. Automate workflows, sync data, and integrate with your existing tools using our REST API."
    >
      <div className="space-y-10">
        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: Globe, label: "REST API", desc: "JSON over HTTPS" },
            { icon: Lock, label: "API Key Auth", desc: "Secure bearer tokens" },
            { icon: Zap, label: "Webhooks", desc: "Real-time event push" },
          ].map(s => (
            <div key={s.label} className="p-5 bg-blue-50 border border-blue-100 rounded-2xl text-center">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3"><s.icon className="h-5 w-5 text-white" /></div>
              <p className="font-black text-slate-800 text-sm">{s.label}</p>
              <p className="text-xs text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Authentication */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Key className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-black text-slate-800">Authentication</h2>
          </div>
          <p className="text-slate-600 text-sm mb-4">All API requests require an API key passed as a Bearer token in the Authorization header.</p>
          <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-emerald-400 overflow-x-auto">
            <p className="text-slate-500 mb-1"># Example request</p>
            <p>curl https://api.propcrm.in/v2/leads \</p>
            <p className="pl-4">-H "Authorization: Bearer YOUR_API_KEY" \</p>
            <p className="pl-4">-H "Content-Type: application/json"</p>
          </div>
          <p className="text-slate-500 text-xs mt-3">Get your API key from <strong>Settings → API Keys</strong> in your Master Matrix Architecture dashboard.</p>
        </div>

        {/* Base URL */}
        <div className="p-5 bg-slate-900 rounded-2xl flex items-center gap-4">
          <div className="w-9 h-9 bg-blue-600/20 rounded-xl flex items-center justify-center shrink-0"><Code2 className="h-4 w-4 text-blue-400" /></div>
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-black mb-0.5">Base URL</p>
            <code className="text-blue-400 font-mono text-sm">https://api.propcrm.in/v2</code>
          </div>
        </div>

        {/* Endpoints */}
        <div>
          <h2 className="text-xl font-black text-slate-900 mb-5">Endpoints</h2>
          <div className="space-y-2">
            {endpoints.map(e => (
              <div key={`${e.method}-${e.path}`} className="flex flex-col md:flex-row md:items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors">
                <span className={`text-xs font-black px-2.5 py-1 rounded-lg w-fit shrink-0 ${methodColors[e.method]}`}>{e.method}</span>
                <code className="font-mono text-sm text-slate-700 shrink-0">{e.path}</code>
                <span className="text-slate-400 text-sm md:ml-auto">{e.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rate limits */}
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
          <h2 className="font-black text-amber-800 mb-2">⚡ Rate Limits</h2>
          <p className="text-amber-700 text-sm">Starter: 100 req/min · Professional: 500 req/min · Enterprise: Unlimited. Rate limit headers are returned on every response.</p>
        </div>

        <div className="text-center">
          <p className="text-slate-400 text-sm mb-3">Need help with the API?</p>
          <a href="mailto:api@aiclex.in" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:scale-105 transition-all">
            <Book className="h-4 w-4" /> api@aiclex.in
          </a>
        </div>
      </div>
    </InnerPageLayout>
  )
}
