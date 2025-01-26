package com.M2I.TDClassroom.model;

import com.M2I.TDClassroom.enums.RoleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Table(name = "Role")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long roleId;

    @Enumerated(EnumType.STRING) // Store the enum as a string in the database
    @Column(name = "role_nom", nullable = false)
    private RoleType roleNom;

    @ManyToMany(mappedBy = "roles")
    private Set<Personne> personnes;
}