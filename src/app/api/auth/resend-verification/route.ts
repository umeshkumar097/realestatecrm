import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // 1. Verify user exists and is not already verified
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
        }

        if ((user as any).emailVerified) {
            return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
        }

        // 2. Generate persistent OTP (6 digits) and update DB
        const token = crypto.randomInt(100000, 999999).toString();
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

        await (prisma as any).$transaction(async (tx: any) => {
            await tx.verificationToken.deleteMany({ where: { email } });
            await tx.verificationToken.create({ data: { email, token, expires } });
        });

        // 4. Dispatch Email
        const dispatch = await sendVerificationEmail(email, user.name || "User", token);

        if (!dispatch.success) {
            return NextResponse.json({ error: "Failed to dispatch email. Check SMTP configuration." }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: "A fresh verification code has been dispatched to your inbox." 
        });

    } catch (error: any) {
        console.error("[Auth] Resend Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
