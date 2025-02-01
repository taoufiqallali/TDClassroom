package com.M2I.TDClassroom.repository;

import com.M2I.TDClassroom.model.Reservation;
import com.M2I.TDClassroom.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByPersonne_PersonneId(Long personneId);

    List<Reservation> findByStatus(ReservationStatus status);

    boolean existsByLocal_IdLocalAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
            Long localId, LocalDate date, LocalTime endTime, LocalTime startTime);
}
