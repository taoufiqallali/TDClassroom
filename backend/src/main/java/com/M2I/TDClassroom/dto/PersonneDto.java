package com.M2I.TDClassroom.dto;

import com.M2I.TDClassroom.enums.Grade;
import com.M2I.TDClassroom.enums.Responsabilite;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonneDto {
    private Long personneId;
    private String nom;
    private String prenom;
    private Date dateNaissance;
    private String email;
    private String cin;
    private String tel;
    private Grade grade;
    private String address;
    private String ville;
    private String codePostale;
    private Responsabilite responsabilite;
    private String nomBanque;
    private String som;
    private String motDePasse;
    private String uniteOrganisation; // Only the name of the UniteOrganisation
    private Set<String> roles; // Only role names
}
