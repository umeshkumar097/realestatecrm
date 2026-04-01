import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendMemberUpdateNotification } from "@/lib/mail";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { agencyId, email: adminEmail } = session.user as any;

    try {
        // 1. Fetch member to verify agency ownership
        const member = await prisma.user.findUnique({
            where: { id },
            include: { agency: true }
        });

        if (!member || member.agencyId !== agencyId) {
            return NextResponse.json({ error: "Member not found in your agency" }, { status: 404 });
        }

        // 2. Prevent admin from deleting themselves
        if (member.id === (session.user as any).id) {
            return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
        }

        const agencyName = member.agency?.name || "Your Agency";

        // 3. Delete member
        await prisma.user.delete({
            where: { id }
        });

        // 4. Notify Admin
        if (adminEmail) {
            await sendMemberUpdateNotification(adminEmail, { name: member.name || "Agent", email: member.email || "" }, "DELETED", agencyName);
        }

        return NextResponse.json({ success: true, message: "Member successfully offboarded" });
    } catch (error: any) {
        console.error("[Staff Deletion Error]:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
