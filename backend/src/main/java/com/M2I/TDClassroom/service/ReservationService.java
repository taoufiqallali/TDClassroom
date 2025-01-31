package com.M2I.TDClassroom.service;

import com.M2I.TDClassroom.dto.ReservationDto;
import com.M2I.TDClassroom.enums.ReservationStatus;
import com.M2I.TDClassroom.model.Local;
import com.M2I.TDClassroom.model.Reservation;
import com.M2I.TDClassroom.model.Equipement;
import com.M2I.TDClassroom.model.Personne;
import com.M2I.TDClassroom.repository.LocalRepository;
import com.M2I.TDClassroom.repository.ReservationRepository;
import com.M2I.TDClassroom.repository.EquipementRepository;
import com.M2I.TDClassroom.repository.PersonneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final LocalRepository localRepository;
    private final EquipementRepository equipementRepository;
    private final PersonneRepository personneRepository;

    @Autowired
    public ReservationService(ReservationRepository reservationRepository,
                              LocalRepository localRepository,
                              EquipementRepository equipementRepository,
                              PersonneRepository personneRepository) {
        this.reservationRepository = reservationRepository;
        this.localRepository = localRepository;
        this.equipementRepository = equipementRepository;
        this.personneRepository = personneRepository;
    }

    public List<ReservationDto> getAllReservations() {
        return reservationRepository.findAll()
                .stream().map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ReservationDto> getMyReservations(Long personneId) {
        return reservationRepository.findByPersonne_PersonneId(personneId)
                .stream().map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ReservationDto> getPendingReservations() {
        return reservationRepository.findByStatus(ReservationStatus.PENDING)
                .stream().map(this::mapToDto)
                .collect(Collectors.toList());
    }


    public Reservation createReservation(Reservation reservation) {

        System.out.println("Local object: " + reservation.getLocal());
        if (reservation.getLocal() != null) {
            System.out.println("Local ID: " + reservation.getLocal().getIdLocal());
        }

        System.out.println("Equipement object: " + reservation.getEquipement());
        if (reservation.getEquipement() != null) {
            System.out.println("Equipement ID: " + reservation.getEquipement().getIdEquipement());
        }

        System.out.println("Personne object: " + reservation.getPersonne());
        if (reservation.getPersonne() != null) {
            System.out.println("Personne ID: " + reservation.getPersonne().getPersonneId());
        }



        // Check if the local is already reserved for the given time slot
        if (reservationRepository.existsByLocal_IdLocalAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                reservation.getLocal().getIdLocal(), reservation.getDate(), reservation.getEndTime(), reservation.getStartTime())) {
            throw new RuntimeException("Local already reserved for this time slot.");
        }

        // Fetch related entities based on IDs if needed
        Local local = localRepository.findById(reservation.getLocal().getIdLocal())
                .orElseThrow(() -> new RuntimeException("Local not found"));
        Equipement equipement = equipementRepository.findById(reservation.getEquipement().getIdEquipement())
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        Personne personne = personneRepository.findById(reservation.getPersonne().getPersonneId())
                .orElseThrow(() -> new RuntimeException("Person not found"));

        // Set the correct entity references if needed
        reservation.setLocal(local);
        reservation.setEquipement(equipement);
        reservation.setPersonne(personne);
        reservation.setStatus(ReservationStatus.APPROVED); // You can adjust the status as needed

        // Save reservation
        return reservationRepository.save(reservation);
    }


    public void updateReservationStatus(Long id, ReservationStatus status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservation.setStatus(status);
        reservationRepository.save(reservation);
    }

    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

    private ReservationDto mapToDto(Reservation reservation) {
        return new ReservationDto(
                reservation.getId(),
                reservation.getLocal().getIdLocal(),
                reservation.getEquipement().getIdEquipement(),
                reservation.getPersonne().getPersonneId(),
                reservation.getDate(),
                reservation.getStartTime(),
                reservation.getEndTime(),
                reservation.getStatus()
        );
    }
}
