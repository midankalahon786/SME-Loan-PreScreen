package com.sme.prescreen.domain.enums;

public enum PreScreenResult {
    READY,                  // eligible + docs complete
    BLOCKED_MISSING_DOCS,   // eligible but docs incomplete
    BLOCKED_INELIGIBLE      // fails rules
}
