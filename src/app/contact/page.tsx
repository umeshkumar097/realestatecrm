"use client"
import InnerPageLayout from "@/components/inner-page-layout"
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react"

export default function ContactPage() {
  return (
    <InnerPageLayout 
      badge="Get in Touch"
      title="Contact Us"
      subtitle="Have questions about PropGOCrm? We're here to help you scale your agency."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Email</p>
                  <a href="mailto:hello@aiclex.in" className="text-sm text-slate-500 hover:text-blue-600">hello@aiclex.in</a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Phone / WhatsApp</p>
                  <a href="https://wa.me/919999999999" className="text-sm text-slate-500 hover:text-emerald-600">+91 99999 99999</a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Office</p>
                  <p className="text-sm text-slate-500">Pune, Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-blue-400" />
              <p className="font-black">Direct Support</p>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Our technical team is available Mon–Fri, 10 AM – 6 PM IST to help with your WhatsApp integration.
            </p>
            <button className="w-full py-3 bg-blue-600 rounded-xl text-sm font-black hover:bg-blue-700 transition-colors">
              Chat on WhatsApp
            </button>
          </div>
        </div>

        <form className="space-y-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
            <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
            <input type="email" placeholder="john@agency.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Message</label>
            <textarea rows={4} placeholder="How can we help?" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm resize-none"></textarea>
          </div>
          <button className="w-full py-4 bg-primary text-white rounded-xl font-black text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2">
            Send Message <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </InnerPageLayout>
  )
}
