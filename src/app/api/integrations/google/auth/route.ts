import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.agencyId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clientId = process.env.GOOGLE_CLIENT_ID
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/google/callback`

    if (!clientId) {
        return NextResponse.json({ 
            error: "Google Client ID not configured. Please add GOOGLE_CLIENT_ID to .env" 
        }, { status: 400 })
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent('https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file')}&` +
        `access_type=offline&` +
        `prompt=consent&` +
        `state=${session.user.agencyId}`

    return NextResponse.redirect(authUrl)
}
