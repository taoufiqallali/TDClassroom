package com.M2I.TDClassroom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "local_equipement")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocalEquipement {
    @Id
    @ManyToOne
    @JoinColumn(name = "id_local", nullable = false)
    private Local local;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_equipement", nullable = false)
    private Equipement equipement;
}