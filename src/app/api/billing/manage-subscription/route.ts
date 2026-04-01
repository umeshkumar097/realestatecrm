import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { action, priceId } = await req.json();
    const { agencyId } = session.user as any;

    try {
        const agency = await prisma.agency.findUnique({
            where: { id: agencyId },
            include: { subscription: true }
        });

        if (!agency?.subscription?.stripeSubscriptionId) {
            return NextResponse.json({ error: "No active Stripe subscription found" }, { status: 400 });
        }

        const subId = agency.subscription.stripeSubscriptionId;

        // 1. CANCEL SUBSCRIPTION (End of period)
        if (action === "CANCEL") {
            await stripe.subscriptions.update(subId, {
                cancel_at_period_end: true
            });
            await prisma.subscription.update({
                where: { agencyId },
                data: { status: "CANCELED" } // Marking as canceled-in-progress
            });
            return NextResponse.json({ message: "Subscription will be canceled at the end of the current period." });
        }

        // 2. RESUME SUBSCRIPTION
        if (action === "RESUME") {
            await stripe.subscriptions.update(subId, {
                cancel_at_period_end: false
            });
            await prisma.subscription.update({
                where: { agencyId },
                data: { status: "ACTIVE" }
            });
            return NextResponse.json({ message: "Subscription renewal has been resumed successfully." });
        }

        // 3. SWITCH PLAN (Upgrade/Downgrade)
        if (action === "SWITCH" && priceId) {
            const subscription = await stripe.subscriptions.retrieve(subId);
            
            await stripe.subscriptions.update(subId, {
                items: [{
                    id: subscription.items.data[0].id,
                    price: priceId,
                }],
                proration_behavior: "always_invoice", // Bill difference immediately
            });

            // The webhook will update the plan in DB, but we do it here for instant UI
            const newPlan = await prisma.subscriptionPlan.findUnique({ where: { stripePriceId: priceId } });
            
            await prisma.subscription.update({
                where: { agencyId },
                data: { plan: newPlan?.name || "Standard" }
            });
            await prisma.agency.update({
                where: { id: agencyId },
                data: { planId: newPlan?.id }
            });

            return NextResponse.json({ message: `Successfully switched to ${newPlan?.name} plan.` });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error: any) {
        console.error("[Subscription Management Error]:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
