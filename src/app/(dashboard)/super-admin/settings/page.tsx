"use client"
import { useState } from "react"
import { 
  ShieldCheck, ShieldAlert, Zap, 
  MessageSquare, Users, Globe,
  Bell, Lock, Trash2, Save,
  Eye, EyeOff
} from "lucide-react"

export default function MasterSettingsPage() {
  const [settings, setSettings] = useState({
    globalRegistration: true,
    maintenanceMode: false,
    freeTrialDays: 14,
    maxAgentsStarter: 3,
    maxAgentsPro: 15,
    aiFeaturesEnabled: true,
    bulkWhatsAppEnabled: true
  })

  const [loading, setLoading] = useState(false)

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Master Settings</h1>
          <p className="text-zinc-500 text-sm font-bold">Configure global feature toggles and system-wide limits.</p>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
            <Save className="h-4 w-4" /> Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-zinc-100 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                <h2 className="font-black text-zinc-800">Feature Toggles</h2>
            </div>
            <div className="p-8 space-y-6">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                      <p className="text-sm font-black text-zinc-800">Public Registration</p>
                      <p className="text-xs text-zinc-500 font-bold">Allow new agencies to sign up without an invite.</p>
                  </div>
                  <button onClick={() => handleToggle('globalRegistration')} className={`w-12 h-6 rounded-full transition-all relative ${settings.globalRegistration ? 'bg-primary' : 'bg-zinc-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.globalRegistration ? 'left-7' : 'left-1'}`} />
                  </button>
               </div>
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                      <p className="text-sm font-black text-zinc-800">System Maintenance Mode</p>
                      <p className="text-xs text-zinc-500 font-bold">Restrict all access except for Super Admins.</p>
                  </div>
                  <button onClick={() => handleToggle('maintenanceMode')} className={`w-12 h-6 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-red-500' : 'bg-zinc-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                  </button>
               </div>
               <div className="flex items-center justify-between border-t border-zinc-50 pt-6">
                  <div className="space-y-1">
                      <p className="text-sm font-black text-zinc-800">AI Intent Extraction</p>
                      <p className="text-xs text-zinc-500 font-bold">Enable GPT-powered lead extraction globally.</p>
                  </div>
                  <button onClick={() => handleToggle('aiFeaturesEnabled')} className={`w-12 h-6 rounded-full transition-all relative ${settings.aiFeaturesEnabled ? 'bg-primary' : 'bg-zinc-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.aiFeaturesEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-zinc-100 flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <h2 className="font-black text-zinc-800">System Defaults</h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Free Trial Period (Days)</label>
                    <input type="number" value={settings.freeTrialDays} className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Global Support Email</label>
                    <input type="email" placeholder="support@aiclex.in" className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold" />
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-zinc-950 p-8 rounded-3xl text-white shadow-xl shadow-zinc-950/20">
              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6">
                 <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black mb-2">Global Broadcast</h3>
              <p className="text-zinc-500 text-xs font-bold leading-relaxed mb-6">Send an emergency notification to all logged-in agencies and agents.</p>
              <textarea placeholder="Write message..." className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm mb-4 outline-none focus:border-zinc-700 h-32" />
              <button className="w-full py-3 bg-white text-zinc-950 rounded-xl font-black text-xs hover:bg-zinc-100 active:scale-95 transition-all">
                  Shoot Notification
              </button>
           </div>

           <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
              <h3 className="text-red-600 font-black flex items-center gap-2 mb-2"><ShieldAlert className="h-4 w-4" /> Danger Zone</h3>
              <p className="text-red-900/60 text-[11px] font-bold mb-4">Actions in this zone are irreversible. Be extremely careful.</p>
              <button className="w-full py-2.5 bg-red-600 text-white rounded-xl font-black text-[11px] hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Trash2 className="h-3.5 w-3.5" /> Purge System Logs
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}
