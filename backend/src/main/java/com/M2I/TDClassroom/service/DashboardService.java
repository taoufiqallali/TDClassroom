package com.M2I.TDClassroom.service;

import com.M2I.TDClassroom.dto.DashboardStats;
import com.M2I.TDClassroom.dto.DayReservationCount;
import com.M2I.TDClassroom.dto.RoomBookingCount;
import com.M2I.TDClassroom.enums.ReservationStatus;
import com.M2I.TDClassroom.model.Reservation;
import com.M2I.TDClassroom.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private  ReservationRepository reservationRepository;

    public DashboardStats getDashboardStats(int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);

        // Get all reservations within date range
        List<Reservation> reservations = reservationRepository.findAll().stream()
                .filter(r -> !r.getDate().isBefore(startDate))
                .collect(Collectors.toList());

        DashboardStats stats = new DashboardStats();

        // Calculate reservation counts by status
        Map<ReservationStatus, Long> statusCounts = reservations.stream()
                .collect(Collectors.groupingBy(
                        Reservation::getStatus,
                        Collectors.counting()
                ));

        stats.setTotalReservations(reservations.size());
        stats.setPendingReservations(statusCounts.getOrDefault(ReservationStatus.PENDING, 0L));
        stats.setApprovedReservations(statusCounts.getOrDefault(ReservationStatus.APPROVED, 0L));
        stats.setRejectedReservations(statusCounts.getOrDefault(ReservationStatus.REJECTED, 0L));
        stats.setFixedReservations(statusCounts.getOrDefault(ReservationStatus.FIXED, 0L));

        // Calculate most booked rooms
        List<RoomBookingCount> mostBookedRooms = reservations.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getLocal().getNom(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(entry -> {
                    RoomBookingCount rbc = new RoomBookingCount();
                    rbc.setLocal_nom(entry.getKey());
                    rbc.setCount(entry.getValue());
                    return rbc;
                })
                .sorted(Comparator.comparingLong(RoomBookingCount::getCount).reversed())
                .limit(5)
                .collect(Collectors.toList());

        stats.setMostBookedRooms(mostBookedRooms);

        // Calculate reservations by day of week
        Map<String, Long> dayCountMap = new LinkedHashMap<>();
        dayCountMap.put("Lundi", 0L);
        dayCountMap.put("Mardi", 0L);
        dayCountMap.put("Mercredi", 0L);
        dayCountMap.put("Jeudi", 0L);
        dayCountMap.put("Vendredi", 0L);
        dayCountMap.put("Samedi", 0L);
        dayCountMap.put("Dimanche", 0L);

        // Count reservations by day
        reservations.forEach(reservation -> {
            DayOfWeek dayOfWeek = reservation.getDate().getDayOfWeek();
            String dayName = getDayName(dayOfWeek);
            dayCountMap.merge(dayName, 1L, Long::sum);
        });

        List<DayReservationCount> reservationsByDay = dayCountMap.entrySet().stream()
                .map(entry -> {
                    DayReservationCount drc = new DayReservationCount();
                    drc.setDay(entry.getKey());
                    drc.setCount(entry.getValue());
                    return drc;
                })
                .collect(Collectors.toList());

        stats.setReservationsByDay(reservationsByDay);

        return stats;
    }

    private String getDayName(DayOfWeek day) {
        return switch (day) {
            case MONDAY -> "Lundi";
            case TUESDAY -> "Mardi";
            case WEDNESDAY -> "Mercredi";
            case THURSDAY -> "Jeudi";
            case FRIDAY -> "Vendredi";
            case SATURDAY -> "Samedi";
            case SUNDAY -> "Dimanche";
        };
    }
}
