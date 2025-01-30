package com.M2I.TDClassroom.model;

import com.M2I.TDClassroom.enums.NomUnite;
import com.M2I.TDClassroom.enums.TypeUnite;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "unite_organisation")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UniteOrganisation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unite")
    private Long idUnite;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 50)
    private TypeUnite type;

    @Enumerated(EnumType.STRING)
    @Column(name = "nom", nullable = false, length = 100, unique = true)
    private NomUnite nom;

    @OneToOne
    @JoinColumn(name = "id_chef")
    @JsonManagedReference
    private Personne chef;

    @OneToOne
    @JoinColumn(name = "id_adjoint")
    @JsonManagedReference
    private Personne adjoint;
}
