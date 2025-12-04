package com.sme.prescreen.service;

import com.sme.prescreen.domain.dto.*;
import com.sme.prescreen.domain.entity.Application;
import com.sme.prescreen.domain.enums.EligibilityStatus;
import com.sme.prescreen.domain.enums.PreScreenResult;
import com.sme.prescreen.repository.ApplicationRepository;
import com.sme.prescreen.security.AuthFacade;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final EligibilityService eligibilityService;
    private final DocumentService documentService;
    private final AuthFacade authFacade;

    // CREATE
    public ApplicationResponseDto create(ApplicationRequestDto dto) {

        Long currentUserId = authFacade.getCurrentUserId();

        Application application = Application.builder()
                .applicantName(dto.getApplicantName())
                .ownerId(currentUserId)  // <-- NOW VALID
                .businessType(dto.getBusinessType())
                .turnoverBand(dto.getTurnoverBand())
                .requestedLoanAmount(dto.getRequestedLoanAmount())
                .yearsInBusiness(dto.getYearsInBusiness())
                .eligibilityStatus(EligibilityStatus.PENDING)
                .preScreenResult(PreScreenResult.BLOCKED_MISSING_DOCS)
                .build();

        Application saved = applicationRepository.save(application);
        return toDto(saved);
    }


    // UPDATE
    public ApplicationResponseDto update(Long id, ApplicationRequestDto dto) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Application not found with id: " + id));

        application.setApplicantName(dto.getApplicantName());
        application.setBusinessType(dto.getBusinessType());
        application.setTurnoverBand(dto.getTurnoverBand());
        application.setRequestedLoanAmount(dto.getRequestedLoanAmount());
        application.setYearsInBusiness(dto.getYearsInBusiness());

        Application saved = applicationRepository.save(application);
        return toDto(saved);
    }

    // GET BY ID
    @Transactional(readOnly = true)
    public ApplicationResponseDto getById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Application not found with id: " + id));
        return toDto(application);
    }

    // GET ALL
    @Transactional(readOnly = true)
    public List<ApplicationResponseDto> getAll() {
        if (authFacade.isStaff()) {
            return applicationRepository.findAll().stream()
                    .map(this::toDto)
                    .toList();
        } else {
            Long ownerId = authFacade.getCurrentUserId();
            return applicationRepository.findByOwnerId(ownerId).stream()
                    .map(this::toDto)
                    .toList();
        }
    }


    // DELETE
    public void delete(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new EntityNotFoundException("Application not found with id: " + id);
        }
        applicationRepository.deleteById(id);
    }

    // 🔥 PRE-SCREEN RESULT GENERATOR
    public PreScreenResultDto evaluatePreScreen(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found: " + applicationId));

        // 1. Evaluate eligibility
        EligibilityResult eligibilityResult = eligibilityService.evaluate(application);
        application.setEligibilityStatus(eligibilityResult.getStatus());

        // 2. Get document summary
        DocSummary docs = documentService.getDocSummary(applicationId);

        PreScreenResult finalResult = getPreScreenResult(docs);

        application.setPreScreenResult(finalResult);
        applicationRepository.save(application);

        return PreScreenResultDto.builder()
                .applicationId(application.getId())
                .eligibilityStatus(application.getEligibilityStatus())
                .preScreenResult(finalResult)
                .eligibilityReasons(eligibilityResult.getReasons())
                .totalRequiredDocs(docs.getTotalRequiredDocs())
                .uploadedMandatoryDocs(docs.getUploadedMandatoryDocs())
                .missingMandatoryDocs(docs.getMissingMandatoryDocs())
                .allMandatoryDocsUploaded(finalResult == PreScreenResult.READY)
                .build();
    }

    private static PreScreenResult getPreScreenResult(DocSummary docs) {
        PreScreenResult finalResult;

        // RULE 1: Missing KYC → Auto Reject
        if (!docs.isKycComplete()) {
            finalResult = PreScreenResult.BLOCKED_INELIGIBLE;
        }
        // RULE 2: All required docs → Ready for appraisal
        else if (docs.isIncomeComplete() && docs.isBusinessProofComplete()) {
            finalResult = PreScreenResult.READY;
        }
        // RULE 3: Income ok, business missing → Conditional Approval
        else if (docs.isIncomeComplete()) {
            finalResult = PreScreenResult.BLOCKED_MISSING_DOCS;   // conditional approval
        }
        // RULE 4: Business ok, income missing → Hold
        else if (docs.isBusinessProofComplete()) {
            finalResult = PreScreenResult.BLOCKED_MISSING_DOCS;   // on hold
        } else {
            // fallback
            finalResult = PreScreenResult.BLOCKED_MISSING_DOCS;
        }
        return finalResult;
    }

    // 🔧 MAPPER: ENTITY → DTO
    private ApplicationResponseDto toDto(Application application) {
        return ApplicationResponseDto.builder()
                .id(application.getId())
                .applicantName(application.getApplicantName())
                .businessType(application.getBusinessType())
                .turnoverBand(application.getTurnoverBand())
                .requestedLoanAmount(application.getRequestedLoanAmount())
                .yearsInBusiness(application.getYearsInBusiness())
                .eligibilityStatus(application.getEligibilityStatus())
                .preScreenResult(application.getPreScreenResult())
                .losApplicationId(application.getLosApplicationId())
                .createdAt(application.getCreatedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}
