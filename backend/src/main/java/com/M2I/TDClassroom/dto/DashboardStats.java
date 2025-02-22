package com.M2I.TDClassroom.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStats {

    private long totalReservations;
    private long pendingReservations;
    private long approvedReservations;
    private long rejectedReservations;
    private long fixedReservations;
    private List<RoomBookingCount> mostBookedRooms;
    private List<DayReservationCount> reservationsByDay;

}
