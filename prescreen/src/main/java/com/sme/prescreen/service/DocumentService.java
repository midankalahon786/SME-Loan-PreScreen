package com.sme.prescreen.service;

import com.sme.prescreen.domain.dto.ApplicationDocumentDto;
import com.sme.prescreen.domain.dto.DocSummary;
import com.sme.prescreen.domain.entity.Application;
import com.sme.prescreen.domain.entity.ApplicationDocument;
import com.sme.prescreen.domain.enums.DocumentCategory;
import com.sme.prescreen.domain.enums.DocumentStatus;
import com.sme.prescreen.domain.enums.DocumentType;
import com.sme.prescreen.repository.ApplicationDocumentRepository;
import com.sme.prescreen.repository.ApplicationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.EnumSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationDocumentRepository documentRepository;

    // Folder where files will be stored
    private final Path rootLocation = Paths.get("uploads");

    // Helper to initialize folder
    private void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    public ApplicationDocument uploadDocument(Long applicationId, DocumentType docType, MultipartFile file) {
        init(); // Ensure folder exists

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found: " + applicationId));

        // Create a unique filename: APPID_DOCTYPE_ORIGINALNAME
        String filename = applicationId + "_" + docType.name() + "_" + file.getOriginalFilename();

        try {
            Files.copy(file.getInputStream(), this.rootLocation.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + filename, e);
        }

        // Check if doc already exists to update it, else create new
        // (Simplification: just create new or update existing record logic here if needed)

        ApplicationDocument doc = ApplicationDocument.builder()
                .application(application)
                .docType(docType)
                .status(DocumentStatus.UPLOADED)
                .filePath(filename) // Store the filename we saved
                .build();

        return documentRepository.save(doc);
    }

    // NEW: Load file as Resource
    public Resource loadFileAsResource(String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Could not read file: " + filename, e);
        }
    }

    @Transactional(readOnly = true)
    public List<ApplicationDocumentDto> getDocumentsForApplication(Long applicationId) {
        if (!applicationRepository.existsById(applicationId)) {
            throw new EntityNotFoundException("Application not found: " + applicationId);
        }
        return documentRepository.findByApplicationId(applicationId).stream().map(this::toDto).toList();
    }

    public ApplicationDocumentDto updateDocumentStatus(Long documentId, DocumentStatus newStatus) {
        ApplicationDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new EntityNotFoundException("Document not found: " + documentId));
        doc.setStatus(newStatus);
        return toDto(documentRepository.save(doc));
    }

    // ... getDocSummary() method remains exactly the same as before ...
    @Transactional(readOnly = true)
    public DocSummary getDocSummary(Long applicationId) {
        EnumSet<DocumentType> mandatoryTypes = EnumSet.noneOf(DocumentType.class);
        for (DocumentType type : DocumentType.values()) if (type.isMandatory()) mandatoryTypes.add(type);

        int totalRequired = mandatoryTypes.size();
        int uploadedMandatory = 0;
        int kycRequired = 0, kycUploaded = 0;
        int incomeRequired = 0, incomeUploaded = 0;
        int businessRequired = 0, businessUploaded = 0;

        for (DocumentType type : mandatoryTypes) {
            boolean satisfied = isMandatoryDocSatisfied(applicationId, type);
            if (type.getCategory() == DocumentCategory.KYC) { kycRequired++; if (satisfied) kycUploaded++; }
            else if (type.getCategory() == DocumentCategory.INCOME_PROOF) { incomeRequired++; if (satisfied) incomeUploaded++; }
            else if (type.getCategory() == DocumentCategory.BUSINESS_PROOF) { businessRequired++; if (satisfied) businessUploaded++; }
            if (satisfied) uploadedMandatory++;
        }

        return DocSummary.builder()
                .kycComplete((kycRequired > 0) && (kycUploaded == kycRequired))
                .incomeComplete((incomeRequired > 0) && (incomeUploaded == incomeRequired))
                .businessProofComplete((businessRequired > 0) && (businessUploaded == businessRequired))
                .totalRequiredDocs(totalRequired)
                .uploadedMandatoryDocs(uploadedMandatory)
                .missingMandatoryDocs(totalRequired - uploadedMandatory)
                .allMandatoryDocsUploaded(totalRequired - uploadedMandatory == 0)
                .build();
    }

    private boolean isMandatoryDocSatisfied(Long applicationId, DocumentType type) {
        List<ApplicationDocument> docs = documentRepository.findByApplicationId(applicationId);
        return docs.stream().filter(d -> d.getDocType() == type).anyMatch(d -> d.getStatus() != DocumentStatus.REJECTED);
    }

    private ApplicationDocumentDto toDto(ApplicationDocument doc) {
        return ApplicationDocumentDto.builder()
                .id(doc.getId())
                .docType(doc.getDocType())
                .docDisplayName(doc.getDocType().getDisplayName())
                .status(doc.getStatus())
                .filePath(doc.getFilePath())
                .uploadedAt(doc.getUploadedAt())
                .build();
    }
}