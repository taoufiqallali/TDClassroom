package com.M2I.TDClassroom.model;

import com.M2I.TDClassroom.enums.RoleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;
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

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Role role = (Role) obj;
        return Objects.equals(roleId, role.roleId); // Compare based on unique identifier (e.g., roleId)
    }

    @Override
    public int hashCode() {
        return Objects.hash(roleId); // Use the unique identifier for hash code calculation
    }
}