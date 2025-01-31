package com.M2I.TDClassroom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EquipementDto {

    private Long idEquipement;
    private String name;
    private String description;
}
