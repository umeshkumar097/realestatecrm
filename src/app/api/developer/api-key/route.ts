import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const agencyId = (session.user as any).agencyId;
    if (!agencyId) return NextResponse.json({ error: "Agency not found" }, { status: 404 });

    try {
        const agency = await prisma.agency.findUnique({
            where: { id: agencyId },
            select: { apiKey: true, apiUsageCount: true }
        });

        return NextResponse.json({ 
            apiKey: agency?.apiKey || null,
            usage: agency?.apiUsageCount || 0
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    
    if (userRole !== "ADMIN" && userRole !== "AGENCY_OWNER") {
        return NextResponse.json({ error: "Only Admins can manage API keys" }, { status: 403 });
    }

    const agencyId = (session?.user as any).agencyId;

    try {
        // Generate a high-entropy API key
        const newKey = `pk_live_${crypto.randomBytes(24).toString("hex")}`;

        await prisma.agency.update({
            where: { id: agencyId },
            data: { apiKey: newKey }
        });

        return NextResponse.json({ 
            success: true, 
            apiKey: newKey,
            message: "API Key successfully rotated"
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
