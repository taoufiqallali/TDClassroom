package com.M2I.TDClassroom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Local")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Local {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_local")
    private Long idLocal;

    @Column(name = "id_unite", nullable = false)
    private Long idUnite;

    @Column(name = "nom", nullable = false, length = 100)
    private String nom;

    @Column(name = "capacite", nullable = false)
    private Integer capacite;

    @Column(name = "accessibilite_pmr", nullable = false)
    private Boolean accessibilitePmr;
}
