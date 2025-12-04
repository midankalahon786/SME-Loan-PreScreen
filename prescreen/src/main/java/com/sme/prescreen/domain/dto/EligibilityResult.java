package com.sme.prescreen.domain.dto;

import com.sme.prescreen.domain.enums.EligibilityStatus;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class EligibilityResult {

    private EligibilityStatus status;      // ELIGIBLE / INELIGIBLE / PENDING
    private List<String> reasons;          // e.g. "TURNOVER_TOO_LOW", "BUSINESS_TOO_NEW"
}
