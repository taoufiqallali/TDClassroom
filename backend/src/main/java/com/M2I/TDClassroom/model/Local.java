package com.M2I.TDClassroom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "local")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Local {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_local")
    private Long idLocal;

    @ManyToOne
    @JoinColumn(name = "id_unite", nullable = false)
    private UniteOrganisation uniteOrganisation;
    @Column(name = "nom", nullable = false, length = 100)
    private String nom;

    @Column(name = "capacite", nullable = false)
    private int capacite;

    @Column(name = "accessibilite_pmr", nullable = false)
    private boolean accessibilitePmr;

    @Column(name = "datashow", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean datashow = false;

    @Column(name = "ecrantactille")
    private Boolean ecranTactile;
}
