package com.sme.prescreen.repository;

import com.sme.prescreen.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Existing methods
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // ✅ ADD THIS "MAGIC" METHOD:
    // This will search the 'email' column OR the 'username' column for the input string
    Optional<User> findByEmailOrUsername(String email, String username);
}