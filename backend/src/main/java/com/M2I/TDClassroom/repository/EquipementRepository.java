package com.M2I.TDClassroom.repository;

import com.M2I.TDClassroom.model.Equipement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface EquipementRepository extends JpaRepository<Equipement, Long> {
}
