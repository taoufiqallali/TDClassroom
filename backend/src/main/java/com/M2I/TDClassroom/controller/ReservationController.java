package com.M2I.TDClassroom.controller;

import com.M2I.TDClassroom.dto.ReservationDto;
import com.M2I.TDClassroom.enums.ReservationStatus;
import com.M2I.TDClassroom.model.Reservation;
import com.M2I.TDClassroom.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:4201, allowedHeaders = \"*\", allowCredentials = \"true\")")  // Add this for Angular
public class ReservationController {
    private final ReservationService reservationService;


    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public List<ReservationDto> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/mine")
    public List<ReservationDto> getMyReservations(@RequestParam Long personneId) {
        return reservationService.getMyReservations(personneId);
    }

    @GetMapping("/pending")
    public List<ReservationDto> getPendingReservations() {
        return reservationService.getPendingReservations();
    }

    @PostMapping
    public ResponseEntity<String> createReservation(@RequestBody Reservation reservation) {
        reservationService.createReservation(reservation);
        return ResponseEntity.ok("reservation created successfully");
    }

    @PutMapping("/{id}/status")
    public void updateReservationStatus(@PathVariable Long id, @RequestParam ReservationStatus status) {
        reservationService.updateReservationStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
    }
}
