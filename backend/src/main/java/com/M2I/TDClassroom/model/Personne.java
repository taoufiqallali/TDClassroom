package com.M2I.TDClassroom.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.Set;
import com.M2I.TDClassroom.enums.Responsabilite;
import com.M2I.TDClassroom.enums.Grade;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Personne {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "personne_id")
    private Long personneId;

    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "prenom", nullable = false)
    private String prenom;

    @Column(name = "Date_naissance", nullable = false)
    private Date dateNaissance;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "CIN", nullable = false, unique = true)
    private String cin;

    @Column(name = "tel", nullable = false, unique = true)
    private String tel;

    @Enumerated(EnumType.STRING)
    @Column(name = "grade", nullable = false)
    private Grade grade;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "ville", nullable = false)
    private String ville;

    @Column(name = "code_postale", nullable = false)
    private String codePostale;

    @Enumerated(EnumType.STRING)
    @Column(name = "responsabilite", nullable = false)
    private Responsabilite responsabilite;

    @Column(name = "nom_banque", nullable = false)
    private String nomBanque;

    @Column(name = "SOM", nullable = false, unique = true)
    private String som;

    @Column(name = "mot_de_passe", nullable = false)
    private String motDePasse;

    @Column(name = "id_unite", nullable = false)
    private Integer idUnite;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "Personne_role",
            joinColumns = @JoinColumn(name = "personne_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )

    private Set<Role> roles;

}
