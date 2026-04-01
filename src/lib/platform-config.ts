export const PLATFORM_CONFIG = {
    company: {
        name: "Aiclex Technologies",
        address: "8125, 8th Floor, Gaur City Mall, Office Space Sector 4, Greater Noida, UP - 201318",
        gstin: "09JAMPK1070B1ZS",
        pan: "JAMPK1070B",
        email: "billing@aiclex.com",
        phone: "+91 91152 72777"
    },
    banking: {
        bankName: "State Bank of India (SBI)",
        accountNumber: "44636629133",
        accountType: "Current Account",
        branch: "Noida Sector 39",
        ifsc: "SBIN0060457"
    },
    invoicing: {
        getFinancialYear: () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1; // 1-12
            
            // Indian FY starts in April
            const fyStart = month >= 4 ? year : year - 1;
            const fyEnd = fyStart + 1;
            
            // Format 26-27 (for 2026-2027)
            return `${fyStart.toString().slice(-2)}-${fyEnd.toString().slice(-2)}`;
        },
        generateNumber: (agencyName: string, sequence: number) => {
            const prefix = (agencyName || "GUEST").slice(0, 3).toUpperCase().padEnd(3, "X");
            const fy = PLATFORM_CONFIG.invoicing.getFinancialYear();
            const seq = sequence.toString().padStart(3, "0");
            return `${prefix}/${fy}/${seq}`;
        }
    }
};
