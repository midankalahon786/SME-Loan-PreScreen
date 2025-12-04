package com.sme.prescreen.controller;

import com.sme.prescreen.domain.dto.ApplicationRequestDto;
import com.sme.prescreen.domain.dto.ApplicationResponseDto;
import com.sme.prescreen.domain.dto.PreScreenResultDto;
import com.sme.prescreen.domain.entity.Application;
import com.sme.prescreen.repository.ApplicationRepository;
import com.sme.prescreen.security.AuthFacade;
import com.sme.prescreen.service.ApplicationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;


import java.util.List;

@Tag(
        name = "Applications",
        description = "Create, view, update and pre-screen SME loan applications."
)
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final ApplicationRepository applicationRepository;
    private final AuthFacade authFacade;

    // CREATE (APPLICANT only)
    @Operation(
            summary = "Create a new SME loan application",
            description = "Used by an APPLICANT to create a draft SME loan application before document upload and pre-screening."
    )
    @ApiResponse(responseCode = "201", description = "Application created")
    @PreAuthorize("hasRole('APPLICANT')")
    @PostMapping
    public ResponseEntity<ApplicationResponseDto> create(
            @Valid @RequestBody ApplicationRequestDto dto) {

        ApplicationResponseDto response = applicationService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // UPDATE (APPLICANT only, owns app, not locked)
    @PreAuthorize("hasRole('APPLICANT') and @authFacade.canAccessApplication(#id)")
    @PutMapping("/{id}")
    public ResponseEntity<ApplicationResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationRequestDto dto) {

        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Application not found with id " + id));

        if (app.isLockedByStaff()) {
            throw new RuntimeException("Application is locked by staff. You cannot modify it.");
        }

        return ResponseEntity.ok(applicationService.update(id, dto));
    }

    // GET BY ID (owner or STAFF)
    @PreAuthorize("@authFacade.canAccessApplication(#id)")
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getById(id));
    }

    // GET ALL (STAFF = all, APPLICANT = own only)
    @PreAuthorize("hasAnyRole('APPLICANT','STAFF')")
    @GetMapping
    public ResponseEntity<List<ApplicationResponseDto>> getAll() {
        return ResponseEntity.ok(applicationService.getAll());
    }

    // DELETE (STAFF only)
    @PreAuthorize("hasRole('STAFF')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        applicationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // PRE-SCREEN (STAFF only)
    @Operation(
            summary = "Run pre-screen checks on an application",
            description = "Used by STAFF to evaluate eligibility + document completeness and produce a pre-screen decision."
    )
    @ApiResponse(responseCode = "200", description = "Pre-screen result generated")
    @PreAuthorize("hasRole('STAFF')")
    @GetMapping("/{id}/pre-screen")
    public ResponseEntity<PreScreenResultDto> evaluatePreScreen(@PathVariable Long id) {
        PreScreenResultDto result = applicationService.evaluatePreScreen(id);
        return ResponseEntity.ok(result);
    }

    // LOCK APPLICATION (STAFF only)
    @PreAuthorize("hasRole('STAFF')")
    @PostMapping("/{id}/lock")
    public ResponseEntity<Void> lockApplication(@PathVariable Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Application not found with id " + id));

        app.setLockedByStaff(true);
        applicationRepository.save(app);

        return ResponseEntity.ok().build();
    }
}
