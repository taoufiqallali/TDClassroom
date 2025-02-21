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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import java.io.ByteArrayOutputStream;



@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final LocalRepository localRepository;
    private final EquipementRepository equipementRepository;
    private final PersonneRepository personneRepository;

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


    public Reservation createReservation(Reservation reservationRequest) {
        // Fetch and set Local
        Local local = localRepository.findById(reservationRequest.getLocal().getIdLocal())
                .orElseThrow(() -> new RuntimeException("Local not found"));
        reservationRequest.setLocal(local);

        // Fetch and set Personne
        Personne personne = personneRepository.findById(reservationRequest.getPersonne().getPersonneId())
                .orElseThrow(() -> new RuntimeException("Personne not found"));
        reservationRequest.setPersonne(personne);

        // Check if a reservation overlaps with the requested time and local
        boolean reservationExists = reservationRepository.existsByLocal_IdLocalAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
                reservationRequest.getLocal().getIdLocal(), reservationRequest.getDate(),
                reservationRequest.getEndTime(), reservationRequest.getStartTime());

        if (reservationExists) {
            throw new RuntimeException("This local is already reserved for the requested time slot.");
        }

        // Set status and save the reservation
        reservationRequest.setStatus(ReservationStatus.PENDING); // Default status
        return reservationRepository.save(reservationRequest);
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
                reservation.getLocal().getIdLocal(), // Fixed Local ID
                reservation.getPersonne().getPersonneId(),
                reservation.getDate(),
                reservation.getStartTime(),
                reservation.getEndTime(),
                reservation.getStatus()
        );
    }

    public byte[] generateApprovedReservationsPdf() {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Paragraph title = new Paragraph("Approved Reservations Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("\n"));

            // Table with 6 columns
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);

            // Table Header
            Font headFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            table.addCell(new PdfPCell(new Phrase("User Name", headFont)));
            table.addCell(new PdfPCell(new Phrase("Email", headFont)));
            table.addCell(new PdfPCell(new Phrase("Classroom", headFont)));
            table.addCell(new PdfPCell(new Phrase("Date", headFont)));
            table.addCell(new PdfPCell(new Phrase("Start Time", headFont)));
            table.addCell(new PdfPCell(new Phrase("End Time", headFont)));

            // Fetch Approved Reservations
            List<Reservation> reservations = reservationRepository.findByStatus(ReservationStatus.APPROVED);

            for (Reservation res : reservations) {
                table.addCell(res.getPersonne().getNom());
                table.addCell(res.getPersonne().getEmail());
                table.addCell(res.getLocal().getNom());
                table.addCell(res.getDate().toString());
                table.addCell(res.getStartTime().toString());
                table.addCell(res.getEndTime().toString());
            }

            document.add(table);
            document.close();

            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }
}
