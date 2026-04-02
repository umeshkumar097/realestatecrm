"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PLATFORM_CONFIG } from "@/lib/platform-config"
import { Loader2, Printer, ArrowLeft, Download, ShieldCheck } from "lucide-react"

export default function InvoiceViewer() {
    const { id } = useParams()
    const router = useRouter()
    const [invoice, setInvoice] = useState<any>(null)
    const [agency, setAgency] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await fetch(`/api/billing/invoice-details?id=${id}`)
                const data = await res.json()
                if (res.ok) {
                    setInvoice(data.invoice)
                    setAgency(data.agency)
                }
            } catch (err) {
                console.error("Failed to fetch invoice")
            } finally {
                setLoading(false)
            }
        }
        fetchInvoice()
    }, [id])

    const handlePrint = () => {
        window.print()
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Loader2 className="animate-spin text-primary h-10 w-10" />
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Rendering Commercial Document...</p>
        </div>
    )

    if (!invoice) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-xl font-black">Invoice Not Found</h1>
            <button onClick={() => router.back()} className="text-primary font-bold">Return to Dashboard</button>
        </div>
    )

    return (
        <div className="min-h-screen bg-zinc-50 py-10 px-4 print:bg-white print:py-0 print:px-0">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Actions - Hidden on Print */}
                <div className="flex items-center justify-between no-print">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        <ArrowLeft size={14}/> Back to Hub
                    </button>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-50 transition-all shadow-sm"
                        >
                            <Printer size={14}/> Print / Save PDF
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                            <Download size={14}/> Thermal Receipt
                        </button>
                    </div>
                </div>

                {/* Main Invoice Paper */}
                <div className="bg-white border border-zinc-200 rounded-[40px] shadow-sm overflow-hidden print:border-none print:shadow-none print:rounded-none">
                    {/* Header */}
                    <div className="bg-zinc-900 p-12 text-white flex flex-col md:flex-row justify-between gap-8">
                        <div>
                            <div className="text-3xl font-black tracking-tighter mb-1">PropGo<span className="text-emerald-400">CRM</span></div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Enterprise Real Estate Infrastructure</p>
                        </div>
                        <div className="text-right">
                            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Invoice</h1>
                            <div className="text-xs font-black text-zinc-500 uppercase tracking-widest">No: {invoice.invoiceNumber}</div>
                        </div>
                    </div>

                    <div className="p-12 space-y-12">
                        {/* Parties */}
                        <div className="grid grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 pb-2">Issued By</h3>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-slate-900">{PLATFORM_CONFIG.company.name}</p>
                                    <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-[200px]">{PLATFORM_CONFIG.company.address}</p>
                                    <div className="pt-2 space-y-0.5">
                                        <p className="text-[10px] font-black uppercase tracking-tight text-slate-800">GSTIN: {PLATFORM_CONFIG.company.gstin}</p>
                                        <p className="text-[10px] font-black uppercase tracking-tight text-slate-800">PAN: {PLATFORM_CONFIG.company.pan}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 text-right">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 pb-2">Billed To</h3>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-slate-900">{agency.name}</p>
                                    <p className="text-xs font-medium text-slate-500 leading-relaxed ml-auto max-w-[200px]">{agency.billingAddress || "No registered address provided"}</p>
                                    <div className="pt-2 space-y-0.5">
                                        <p className="text-[10px] font-black uppercase tracking-tight text-slate-800">GSTIN: {agency.gstNumber || "N/A"}</p>
                                        <p className="text-[10px] font-black uppercase tracking-tight text-slate-800">Contact: {agency.billingEmail || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dates & Totals Header */}
                        <div className="bg-zinc-50 rounded-2xl p-6 grid grid-cols-4 gap-4 text-center">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Invoice Date</p>
                                <p className="text-xs font-black text-slate-800">{new Date(invoice.generatedAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Due Date</p>
                                <p className="text-xs font-black text-slate-800">On Receipt</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Currency</p>
                                <p className="text-xs font-black text-slate-800">INR (₹)</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Payment Status</p>
                                <p className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest inline-block ${invoice.amount === 0 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                    {invoice.status}
                                </p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-2 border-slate-900">
                                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-900">Description</th>
                                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-900 text-center">Quantity</th>
                                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-900 text-right">Unit Price</th>
                                        <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-900 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    <tr className="group">
                                        <td className="py-6">
                                            <p className="text-sm font-black text-slate-900">{invoice.planSnapshot} Subscription</p>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">SaaS Recurring Charge - {new Date(invoice.generatedAt).toLocaleString("default", { month: "long", year: "numeric" })}</p>
                                        </td>
                                        <td className="py-6 text-center text-sm font-bold text-slate-600">1</td>
                                        <td className="py-6 text-right text-sm font-black text-slate-900">₹{invoice.amount.toLocaleString()}</td>
                                        <td className="py-6 text-right text-sm font-black text-slate-900">₹{invoice.amount.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Summary */}
                        <div className="flex justify-end pt-8">
                            <div className="w-full max-w-xs space-y-3">
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span>₹{invoice.amount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-zinc-100 pb-3">
                                    <span>Tax (Integrated GST 0%)</span>
                                    <span>₹0.00</span>
                                </div>
                                <div className="flex justify-between items-center pt-3">
                                    <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Grand Total</span>
                                    <span className="text-2xl font-black text-slate-900">₹{invoice.amount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bank Details & Notes */}
                        <div className="grid grid-cols-2 gap-12 pt-12 border-t border-zinc-100">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Payment Instructions</h3>
                                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 space-y-3">
                                    <div className="flex items-center gap-2 text-emerald-800 font-black text-[10px] uppercase tracking-widest mb-1">
                                        <ShieldCheck size={14}/> Secure Bank Transfer
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                        <div>
                                            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Beneficiary</p>
                                            <p className="text-[10px] font-bold text-slate-800">{PLATFORM_CONFIG.company.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Bank Name</p>
                                            <p className="text-[10px] font-bold text-slate-800">{PLATFORM_CONFIG.banking.bankName}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Account Number</p>
                                            <p className="text-[10px] font-bold text-slate-800 tracking-wider">{PLATFORM_CONFIG.banking.accountNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">IFSC Code</p>
                                            <p className="text-[10px] font-bold text-slate-800 uppercase">{PLATFORM_CONFIG.banking.ifsc}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Terms & Conditions</h3>
                                <ul className="text-[9px] text-zinc-400 font-bold space-y-2 leading-relaxed">
                                    <li>1. This is a computer-generated invoice and does not require a physical signature.</li>
                                    <li>2. Payments should be made in favor of Aiclex Technologies to the details provided.</li>
                                    <li>3. Delayed payments may result in temporary suspension of Master Matrix agency services.</li>
                                    <li>4. For any billing inquiries, please contact {PLATFORM_CONFIG.company.email}.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-50 p-8 text-center text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                        Certified Saas Document - Master Real Estate Matrix Ecosystem
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; padding: 0 !important; }
                }
            `}</style>
        </div>
    )
}
