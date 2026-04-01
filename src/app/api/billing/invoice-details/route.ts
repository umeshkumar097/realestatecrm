import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Invoice ID required" }, { status: 400 });

    try {
        const invoice = await (prisma as any).platformInvoice.findUnique({
            where: { id },
            include: { agency: true }
        });

        if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

        // Security Check: Only the agency owner or Super Admin can view
        const { agencyId, role } = session.user as any;
        if (role !== "SUPER_ADMIN" && invoice.agencyId !== agencyId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({
            invoice,
            agency: invoice.agency
        });
    } catch (error: any) {
        console.error("[Invoice details error]:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
