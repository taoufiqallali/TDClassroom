package com.M2I.TDClassroom.repository;

import com.M2I.TDClassroom.model.Personne;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PersonneRepository extends JpaRepository<Personne, Long> {
    Optional<Personne> findByEmail(String email);
}
