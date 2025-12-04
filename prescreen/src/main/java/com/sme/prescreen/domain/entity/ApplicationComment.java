package com.sme.prescreen.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;

@Entity
@Table(name = "application_comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long applicationId;

    @Column(nullable = false)
    private String authorName;

    @Column(nullable = false)
    private String authorRole; // "STAFF" or "APPLICANT"

    @Column(nullable = false, length = 1000)
    private String message;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;
}