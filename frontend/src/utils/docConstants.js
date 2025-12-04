// Matches backend 'DocumentType' enum
export const DOC_TYPES = {
    // KYC
    BUSINESS_PAN: { label: "Business PAN Card", category: "KYC", mandatory: true },
    OWNER_PAN: { label: "Owner's PAN Card", category: "KYC", mandatory: true },
    OWNER_AADHAAR: { label: "Owner's Aadhaar", category: "KYC", mandatory: true },
    BUSINESS_ADDRESS_PROOF: { label: "Office Address Proof", category: "KYC", mandatory: true },

    // INCOME
    PNL_3Y: { label: "P&L Statement (3 Years)", category: "INCOME", mandatory: true },
    BALANCE_SHEET_3Y: { label: "Balance Sheet (3 Years)", category: "INCOME", mandatory: true },
    ITR_3Y: { label: "ITR Acknowledgement (3 Years)", category: "INCOME", mandatory: true },
    BANK_STATEMENT_6_12M: { label: "Bank Statement (6-12 Months)", category: "INCOME", mandatory: true },

    // BUSINESS
    BUSINESS_REGISTRATION: { label: "Business Registration Cert", category: "BUSINESS", mandatory: true },
    CIN: { label: "Corporate Identity Number (CIN)", category: "BUSINESS", mandatory: false },
    BOARD_OF_DIRECTORS_LIST: { label: "List of Directors", category: "BUSINESS", mandatory: false },
};

export const getDocsByCategory = (category) => {
    return Object.entries(DOC_TYPES)
        .filter(([key, val]) => val.category === category)
        .map(([key, val]) => ({ type: key, ...val }));
};