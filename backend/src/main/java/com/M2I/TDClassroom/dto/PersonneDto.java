package com.M2I.TDClassroom.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonneDto {
    private Long personneId;
    private String nom;
    private String prenom;
    private String email;
    private String tel;
    private String grade;
    private Set<String> roles;
}
