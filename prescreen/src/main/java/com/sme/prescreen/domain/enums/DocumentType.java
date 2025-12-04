package com.sme.prescreen.domain.enums;

public enum DocumentType {

    // KYC
    BUSINESS_PAN(DocumentCategory.KYC, "PAN Card of Business", true),
    OWNER_PAN(DocumentCategory.KYC, "PAN Card of Business Owner", true),
    OWNER_AADHAAR(DocumentCategory.KYC, "Aadhaar of Business Owner", true),
    BUSINESS_ADDRESS_PROOF(DocumentCategory.KYC, "Address Proof of Business Office", true),

    // INCOME PROOF
    PNL_3Y(DocumentCategory.INCOME_PROOF, "Profit & Loss Statement (3 years)", true),
    BALANCE_SHEET_3Y(DocumentCategory.INCOME_PROOF, "Balance Sheet (3 years)", true),
    ITR_3Y(DocumentCategory.INCOME_PROOF, "ITR (3 years)", true),
    BANK_STATEMENT_6_12M(DocumentCategory.INCOME_PROOF, "Bank Statement (6–12 months)", true),

    // BUSINESS PROOF
    BUSINESS_REGISTRATION(DocumentCategory.BUSINESS_PROOF, "Business Registration Document", true),
    CIN(DocumentCategory.BUSINESS_PROOF, "Corporate Identification Number", false),
    BOARD_OF_DIRECTORS_LIST(DocumentCategory.BUSINESS_PROOF, "List of Board of Directors", false);

    private final DocumentCategory category;
    private final String displayName;
    private final boolean mandatory;

    DocumentType(DocumentCategory category, String displayName, boolean mandatory) {
        this.category = category;
        this.displayName = displayName;
        this.mandatory = mandatory;
    }

    public DocumentCategory getCategory() {
        return category;
    }

    public String getDisplayName() {
        return displayName;
    }

    public boolean isMandatory() {
        return mandatory;
    }
}
