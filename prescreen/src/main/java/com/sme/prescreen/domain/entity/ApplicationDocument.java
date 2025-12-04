package com.sme.prescreen.domain.entity;

import com.sme.prescreen.domain.enums.DocumentStatus;
import com.sme.prescreen.domain.enums.DocumentType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "application_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id")
    private Application application;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType docType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentStatus status;   // UPLOADED / VERIFIED / REJECTED

    @Column(nullable = false)
    private String filePath;         // path/URL/filename

    @CreationTimestamp
    @Column(updatable = false)
    private Instant uploadedAt;
}
