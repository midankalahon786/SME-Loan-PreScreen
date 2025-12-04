package com.sme.prescreen.controller;

import com.sme.prescreen.domain.dto.ApplicationDocumentDto;
import com.sme.prescreen.domain.dto.DocSummary;
import com.sme.prescreen.domain.entity.Application;
import com.sme.prescreen.domain.entity.ApplicationDocument;
import com.sme.prescreen.domain.enums.DocumentStatus;
import com.sme.prescreen.domain.enums.DocumentType;
import com.sme.prescreen.repository.ApplicationRepository;
import com.sme.prescreen.security.AuthFacade;
import com.sme.prescreen.service.DocumentService;
import jakarta.annotation.Resource;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import java.util.List;

@Tag(
        name = "Documents",
        description = "Upload, list and verify KYC, income and business proof documents for an application."
)
@RestController
@RequestMapping("/api/applications/{applicationId}/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final ApplicationRepository applicationRepository;
    private final AuthFacade authFacade;

    // UPLOAD (APPLICANT, owns app, not locked)
    @Operation(
            summary = "Upload a document for an application",
            description = "Used by APPLICANT to upload mandatory documents like PAN, Aadhaar, ITR, bank statements etc."
    )
    @ApiResponse(responseCode = "200", description = "Document uploaded")
    @PreAuthorize("hasRole('APPLICANT') and @authFacade.canAccessApplication(#applicationId)")
    @PostMapping
    public ResponseEntity<ApplicationDocument> uploadDocument(
            @PathVariable Long applicationId,
            @RequestParam("docType") DocumentType docType,
            @RequestParam("file") MultipartFile file) {

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found"));

        if (app.isLockedByStaff()) {
            throw new RuntimeException("Application is locked. Cannot upload documents.");
        }

        ApplicationDocument saved = documentService.uploadDocument(applicationId, docType, file);
        return ResponseEntity.ok(saved);
    }

    // LIST DOCS (owner or STAFF)
    @PreAuthorize("@authFacade.canAccessApplication(#applicationId)")
    @GetMapping
    public ResponseEntity<List<ApplicationDocumentDto>> listDocuments(@PathVariable Long applicationId) {
        return ResponseEntity.ok(documentService.getDocumentsForApplication(applicationId));
    }

    // SUMMARY (owner or STAFF)
    @Operation(
            summary = "Get document completeness summary",
            description = "Returns whether KYC, income proof and business proof categories are complete for the given application."
    )
    @ApiResponse(responseCode = "200", description = "Summary returned")
    @PreAuthorize("@authFacade.canAccessApplication(#applicationId)")
    @GetMapping("/summary")
    public ResponseEntity<DocSummary> getSummary(@PathVariable Long applicationId) {
        return ResponseEntity.ok(documentService.getDocSummary(applicationId));
    }

    // UPDATE STATUS (STAFF only)
    @PreAuthorize("hasRole('STAFF')")
    @PatchMapping("/{documentId}/status")
    public ResponseEntity<ApplicationDocumentDto> updateStatus(
            @PathVariable Long documentId,
            @RequestParam DocumentStatus status) {

        return ResponseEntity.ok(documentService.updateDocumentStatus(documentId, status));
    }
    @GetMapping("/{documentId}/preview")
    @PreAuthorize("@authFacade.canAccessApplication(#applicationId)")
    public ResponseEntity<Resource> previewDocument(
            @PathVariable Long applicationId,
            @PathVariable Long documentId) {

        // 1. Find the document metadata
        // Note: You might need to add findById to your service or repo, or just use repo here for simplicity
        // Ideally, do this in service, but for brevity:
        com.sme.prescreen.domain.entity.ApplicationDocument doc = documentService.getDocumentsForApplication(applicationId).stream()
                .filter(d -> d.getId().equals(documentId))
                .map(dto -> com.sme.prescreen.domain.entity.ApplicationDocument.builder().filePath(dto.getFilePath()).build()) // Quick hack to get path
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // 2. Load file
        Resource file = (Resource) documentService.loadFileAsResource(doc.getFilePath());

        // 3. Determine Content Type (PDF or Image)
        String contentType = "application/octet-stream";
        try {
            if (doc.getFilePath().toLowerCase().endsWith(".pdf")) contentType = "application/pdf";
            else if (doc.getFilePath().toLowerCase().endsWith(".jpg")) contentType = "image/jpeg";
            else if (doc.getFilePath().toLowerCase().endsWith(".png")) contentType = "image/png";
        } catch (Exception ex) { }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getFilePath() + "\"")
                .body(file);
    }
}


