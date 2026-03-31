import { prisma } from "@/lib/prisma"

export async function syncLeadToGoogleSheets(lead: any) {
    try {
        const config = await prisma.googleSheetSync.findUnique({
            where: { agencyId: lead.agencyId }
        })

        if (!config || !config.isActive || !config.spreadsheetId) return

        let accessToken = config.accessToken

        // Try appending
        const appendVal = async (token: string) => {
            const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    values: [[
                        new Date(lead.createdAt).toLocaleString(),
                        lead.name || "N/A",
                        lead.email || "N/A",
                        lead.phone || "N/A",
                        lead.location || "N/A",
                        lead.budget || "N/A",
                        lead.notes || "N/A"
                    ]]
                })
            })
            return res
        }

        let response = await appendVal(accessToken!)

        // If unauthorized, try refreshing token
        if (response.status === 401 && config.refreshToken) {
            const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
                method: "POST",
                body: new URLSearchParams({
                    client_id: process.env.GOOGLE_CLIENT_ID!,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                    refresh_token: config.refreshToken,
                    grant_type: "refresh_token",
                }),
            })

            const tokens = await tokenRes.json()
            if (tokenRes.ok) {
                accessToken = tokens.access_token
                await prisma.googleSheetSync.update({
                    where: { agencyId: lead.agencyId },
                    data: { accessToken }
                })
                response = await appendVal(accessToken!)
            }
        }

        if (response.ok) {
            await prisma.googleSheetSync.update({
                where: { agencyId: lead.agencyId },
                data: { lastSyncedAt: new Date() }
            })
        }
    } catch (error) {
        console.error("Google Sheets Sync Error:", error)
    }
}
