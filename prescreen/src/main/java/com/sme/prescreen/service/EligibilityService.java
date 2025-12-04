package com.sme.prescreen.service;

import com.sme.prescreen.domain.dto.EligibilityResult;
import com.sme.prescreen.domain.entity.Application;

public interface EligibilityService {

    EligibilityResult evaluate(Application application);
}
