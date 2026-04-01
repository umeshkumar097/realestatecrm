import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PLATFORM_CONFIG } from "@/lib/platform-config";

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    
    // For local testing, we allow non-auth if env is DEV
    if (!isCron && process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // 1. Fetch all active agencies with their subscription plans
        const agencies = await prisma.agency.findMany({
            where: { status: "ACTIVE" },
            include: {
                subscription: true,
                plan: true
            }
        });

        let generatedCount = 0;
        let skippedCount = 0;

        for (const agency of agencies) {
            // Check if invoice already exists for this month
            const existing = await (prisma as any).platformInvoice.findFirst({
                where: {
                    agencyId: agency.id,
                    generatedAt: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                }
            });

            if (existing) {
                skippedCount++;
                continue;
            }

            // Determine Amount (0 for Lifetime if specified, or current plan price)
            let amount = agency.plan?.monthlyPrice || 0;
            // Lifetime detection (if currentPeriodEnd is set far in the future or status is ACTIVE without stripeSubscriptionId)
            const isLifetime = !agency.subscription?.stripeSubscriptionId && agency.subscription?.status === "ACTIVE";
            if (isLifetime) amount = 0;

            // Get Next Sequence Number for this agency
            const lastInvoice = await (prisma as any).platformInvoice.findFirst({
                where: { agencyId: agency.id },
                orderBy: { sequenceNumber: "desc" }
            });
            const nextSeq = (lastInvoice?.sequenceNumber || 0) + 1;

            // Generate Professional Invoice Number (e.g. PRO/26-27/001)
            const invoiceNumber = PLATFORM_CONFIG.invoicing.generateNumber(agency.name, nextSeq);

            // Create Record
            await (prisma as any).platformInvoice.create({
                data: {
                    agencyId: agency.id,
                    invoiceNumber,
                    sequenceNumber: nextSeq,
                    amount,
                    status: amount === 0 ? "ZERO" : "PAID",
                    planSnapshot: agency.plan?.name || "Standard Tier",
                    generatedAt: new Date()
                }
            });

            generatedCount++;
        }

        return NextResponse.json({
            success: true,
            message: `Invoice cycle complete. Generated: ${generatedCount}, Skipped (Already existed): ${skippedCount}`,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error("[Invoice Cron Failed]:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
