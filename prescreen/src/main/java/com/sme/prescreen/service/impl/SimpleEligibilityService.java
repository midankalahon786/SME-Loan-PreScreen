package com.sme.prescreen.service.impl;

import com.sme.prescreen.domain.dto.EligibilityResult;
import com.sme.prescreen.domain.entity.Application;
import com.sme.prescreen.domain.enums.EligibilityStatus;
import com.sme.prescreen.service.EligibilityService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class SimpleEligibilityService implements EligibilityService {

    @Override
    public EligibilityResult evaluate(Application application) {
        List<String> reasons = new ArrayList<>();
        EligibilityStatus status = EligibilityStatus.ELIGIBLE;

        // Example rule 1: business must be at least 1 year old
        if (application.getYearsInBusiness() == null || application.getYearsInBusiness() < 1) {
            status = EligibilityStatus.INELIGIBLE;
            reasons.add("BUSINESS_TOO_NEW");
        }

        // Example rule 2: minimum loan amount
        if (application.getRequestedLoanAmount() == null ||
                application.getRequestedLoanAmount().compareTo(new BigDecimal("50000")) < 0) {
            status = EligibilityStatus.INELIGIBLE;
            reasons.add("LOAN_AMOUNT_TOO_LOW");
        }

        // Example rule 3: missing basic fields
        if (application.getApplicantName() == null || application.getApplicantName().isBlank()) {
            status = EligibilityStatus.INELIGIBLE;
            reasons.add("APPLICANT_NAME_MISSING");
        }

        // You can add more rules later or convert this to config-driven

        return EligibilityResult.builder()
                .status(status)
                .reasons(reasons)
                .build();
    }
}
