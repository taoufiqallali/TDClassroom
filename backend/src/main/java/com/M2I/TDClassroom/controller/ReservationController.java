package com.M2I.TDClassroom.controller;

import com.M2I.TDClassroom.dto.ReservationDto;
import com.M2I.TDClassroom.enums.ReservationStatus;
import com.M2I.TDClassroom.model.Reservation;
import com.M2I.TDClassroom.service.ReservationService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:4201", allowedHeaders = "*", allowCredentials = "true")
public class ReservationController {
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public List<ReservationDto> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/{personneId}")
    public List<ReservationDto> getMyReservations(@PathVariable Long personneId) {
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
    public void updateReservationStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        ReservationStatus status = ReservationStatus.valueOf(request.get("status"));
        reservationService.updateReservationStatus(id, status);
    }


    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> downLoadApprovedReservationsPdf(){
        byte[] pdf = reservationService.generateApprovedReservationsPdf();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=approved_reservations.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

}
