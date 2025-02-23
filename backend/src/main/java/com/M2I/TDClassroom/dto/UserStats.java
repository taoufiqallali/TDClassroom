package com.M2I.TDClassroom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserStats {
    private long totalReservations;
    private long pendingReservations;
    private long approvedReservations;
    private long rejectedReservations;
}