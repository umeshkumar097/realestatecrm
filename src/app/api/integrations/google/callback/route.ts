import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code")
    const agencyId = req.nextUrl.searchParams.get("state")

    if (!code || !agencyId) {
        return NextResponse.json({ error: "Missing authorization code or state" }, { status: 400 })
    }

    try {
        const clientId = process.env.GOOGLE_CLIENT_ID
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/google/callback`

        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            body: new URLSearchParams({
                code,
                client_id: clientId!,
                client_secret: clientSecret!,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
        })

        const tokens = await tokenRes.json()
        if (!tokenRes.ok) throw new Error(tokens.error_description || "Token exchange failed")

        const { access_token, refresh_token } = tokens

        // Create spreadsheet "PropGOCrm Leads" for the agency
        const sheetRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                properties: { title: "PropGOCrm Leads Sync" },
            }),
        })

        const spreadsheet = await sheetRes.json()
        if (!sheetRes.ok) throw new Error(spreadsheet.error?.message || "Failed to create spreadsheet")

        const spreadsheetId = spreadsheet.spreadsheetId

        // Add headers to the new sheet
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:G1?valueInputOption=USER_ENTERED`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                values: [["Created At", "Name", "Email", "Phone", "Location", "Budget", "Notes"]]
            })
        })

        // Store sync config
        await prisma.googleSheetSync.upsert({
            where: { agencyId },
            update: {
                spreadsheetId,
                accessToken: access_token,
                refreshToken: refresh_token || undefined,
                isActive: true,
                lastSyncedAt: new Date(),
            },
            create: {
                agencyId,
                spreadsheetId,
                accessToken: access_token,
                refreshToken: refresh_token,
                isActive: true,
                lastSyncedAt: new Date(),
            }
        })

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/integrations?status=google_connected`)
    } catch (error: any) {
        console.error("Google Auth Error:", error)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/integrations?status=error&message=${encodeURIComponent(error.message)}`)
    }
}
