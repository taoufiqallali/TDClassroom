package com.M2I.TDClassroom.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.M2I.TDClassroom.enums.Status;


@Entity
@Table(name = "reservation")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reservation")
    private Long idReservation;

    @ManyToOne
    @JoinColumn(name = "id_utilisateur", nullable = false)
    private Personne utilisateur;

    @ManyToOne
    @JoinColumn(name = "id_local", nullable = false)
    private Local local;

    @Column(name = "date_reservation", nullable = false)
    private String dateReservation;

    @Column(name = "heure_reservation", nullable = false)
    private String heureReservation;

    @Column(name = "duree", nullable = false)
    private int duree;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;
}

