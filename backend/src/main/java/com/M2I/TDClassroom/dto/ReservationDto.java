package com.M2I.TDClassroom.dto;

import com.M2I.TDClassroom.enums.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationDto {
    private Long id;
    private Long idLocal;
    private Long idEquipement;
    private Long personneId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private ReservationStatus status;
}
