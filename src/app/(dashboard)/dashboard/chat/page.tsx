"use client"
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { 
  Send, Phone, User, Search, 
  MoreVertical, CheckCheck, Loader2,
  Building2, MessageSquare, AlertCircle, Bell
} from "lucide-react"

export default function ChatPage() {
  const { data: session } = useSession()
  const [leads, setLeads] = useState<any[]>([])
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loadingLeads, setLoadingLeads] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [whatsappStatus, setWhatsappStatus] = useState<string>("UNKNOWN")
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastTotalMessagesRef = useRef<number>(0)

  // 1. Load Leads (with polling for notifications)
  useEffect(() => {
    async function loadLeads() {
      try {
        const res = await fetch("/api/leads")
        if (res.ok) {
          const data = await res.json()
          const leadsArray = data.leads || []
          setLeads(leadsArray)
          
          // Check for new messages globally for notifications
          const totalMsgs = leadsArray.reduce((acc: number, lead: any) => acc + (lead._count?.messages || 0), 0)
          if (lastTotalMessagesRef.current > 0 && totalMsgs > lastTotalMessagesRef.current) {
            // New message detected!
            if (Notification.permission === "granted") {
              new Notification("New Client Message", {
                body: "You have a new message on WhatsApp CRM",
                icon: "/favicon.ico"
              })
            }
          }
          lastTotalMessagesRef.current = totalMsgs
        }
      } catch (err) {
        console.error("Failed to load leads", err)
      } finally {
        setLoadingLeads(false)
      }
    }
    loadLeads()
    const interval = setInterval(loadLeads, 5000)
    return () => clearInterval(interval)
  }, [])

  // 1.5 Request Notification Permission
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
          setNotificationsEnabled(permission === "granted")
        })
      } else {
        setNotificationsEnabled(Notification.permission === "granted")
      }
    }
  }, [])

  // 2. Check WhatsApp Status
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/whatsapp")
        if (res.ok) {
          const data = await res.json()
          setWhatsappStatus(data.status)
        }
      } catch (e) {}
    }
    checkStatus()
    const interval = setInterval(checkStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  // 3. Load Messages for selected lead
  useEffect(() => {
    if (!selectedLead) return
    
    setLoadingMessages(true)
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/whatsapp/messages?leadId=${selectedLead.id}`)
        if (res.ok) {
          const data = await res.json()
          setMessages(data)
        }
      } catch (e) {} finally {
        setLoadingMessages(false)
      }
    }
    fetchMessages()

    // Polling for new messages
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/whatsapp/messages?leadId=${selectedLead.id}`)
        if (res.ok) {
          const data = await res.json()
          setMessages(data)
        }
      } catch (e) {}
    }, 3000)

    return () => clearInterval(interval)
  }, [selectedLead])

  // 4. Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // 5. Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedLead) return

    setSending(true)
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: selectedLead.phone,
          message: newMessage
        })
      })

      const data = await res.json()

      if (res.ok) {
        setNewMessage("")
        // Refresh messages immediately
        const resMsg = await fetch(`/api/whatsapp/messages?leadId=${selectedLead.id}`)
        if (resMsg.ok) {
          const dataMsg = await resMsg.json()
          setMessages(dataMsg)
        }
      } else {
        alert(data.error || "Failed to send message")
      }
    } catch (err: any) {
      console.error("Chat Send Error:", err)
      alert("Network Error: Could not reach chat server.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="h-[calc(100vh-120px)] flex bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      {/* Sidebar: Lead List */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-800">Conversations</h2>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${notificationsEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
              <Bell className="h-3 w-3" /> {notificationsEnabled ? 'Alerts ON' : 'Alerts OFF'}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingLeads ? (
            <div className="p-8 text-center text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-xs">Loading leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <AlertCircle className="h-6 w-6 mx-auto mb-2" />
              <p className="text-xs">No active conversations</p>
            </div>
          ) : (
            leads.map(lead => (
              <button 
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`w-full p-4 flex items-center gap-3 border-b border-slate-100/50 transition-all text-left ${selectedLead?.id === lead.id ? "bg-white border-l-4 border-primary shadow-sm" : "hover:bg-white"}`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-primary font-black text-sm shrink-0">
                  {lead.name?.charAt(0) || "L"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="text-sm font-black text-slate-800 truncate">{lead.name || lead.phone}</p>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">12m</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{lead.notes || "New inquiry via WhatsApp"}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedLead ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black">
                  {selectedLead.name?.charAt(0) || "L"}
                </div>
                <div>
                  <p className="font-black text-slate-800 leading-none mb-1">{selectedLead.name || selectedLead.phone}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <CheckCheck className={`h-3 w-3 ${whatsappStatus === 'CONNECTED' ? 'text-emerald-500' : 'text-slate-300'}`} />
                    {whatsappStatus === 'CONNECTED' ? 'WhatsApp Online' : 'Check status'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><Phone className="h-4 w-4" /></button>
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><MoreVertical className="h-4 w-4" /></button>
              </div>
            </div>

            {/* Messages Thread */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
              {loadingMessages && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                  <MessageSquare className="h-12 w-12 mb-3 opacity-20" />
                  <p className="text-sm">Start the conversation with {selectedLead.name || selectedLead.phone}</p>
                </div>
              ) : (
                messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${m.fromMe ? "bg-primary text-white rounded-tr-none" : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"}`}>
                      <p className="leading-relaxed">{m.content}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <p className={`text-[10px] ${m.fromMe ? "text-primary-foreground/70" : "text-slate-400"}`}>
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {m.fromMe && (
                          <div className={`flex items-center shrink-0`}>
                            {m.status === "READ" ? (
                              <CheckCheck className="h-3 w-3 text-blue-300" />
                            ) : m.status === "DELIVERED" ? (
                              <CheckCheck className="h-3 w-3 text-slate-300" />
                            ) : (
                              <Send className="h-2 w-2 text-slate-300" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder={`Reply to ${selectedLead.name || selectedLead.phone}...`}
                  className="flex-1 px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary transition-all"
                  disabled={sending || whatsappStatus !== 'CONNECTED'}
                />
                <button 
                  type="submit"
                  disabled={sending || !newMessage.trim() || whatsappStatus !== 'CONNECTED'}
                  className="px-5 py-3 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </form>
              {whatsappStatus !== 'CONNECTED' && (
                <p className="text-[10px] text-amber-600 mt-2 font-bold flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Connect WhatsApp to send messages
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/20">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center mb-6">
              <MessageSquare className="h-10 w-10 text-primary animate-pulse" />
            </div>
            <h2 className="text-xl font-black text-slate-800">Select a lead to chat</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">Click on a conversation from the sidebar to start responding to your inquiries.</p>
          </div>
        )}
      </div>
    </div>
  )
}
