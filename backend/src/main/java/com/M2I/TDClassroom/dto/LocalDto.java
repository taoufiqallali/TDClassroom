package com.M2I.TDClassroom.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LocalDto {

    private Long idLocal;
    private String nom;  // Name of the local
    private int capacite;  // Capacity of the local
    private boolean accessibilitePmr;  // Accessibility for PMR
    private String uniteOrganisationNom;  // Name of the associated UniteOrganisation

}
