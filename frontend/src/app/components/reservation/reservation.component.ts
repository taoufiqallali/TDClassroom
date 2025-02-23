import { Component, OnInit } from '@angular/core';
import { roomlistservice, Room_list } from '../../services/room-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationList, reservationService } from '../../services/reservation.service';
import { User_list, UserService } from '../../services/user_list.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation',
  imports: [CommonModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit {
  // Injection des dépendances dans le constructeur
  constructor(
    private snackBar: MatSnackBar,
    private roomService: roomlistservice,
    private userService: UserService,
    private reservationService: reservationService
  ) { }

  // Déclaration des variables pour stocker les données
  reservations: ReservationList[] = []; // Liste de toutes les réservations
  pending: ReservationList[] = []; // Liste des réservations en attente (statut 'PENDING')
  rooms: Room_list[] = []; // Liste des locaux/salles
  users: User_list[] = []; // Liste des utilisateurs

  // Méthode ngOnInit du cycle de vie du composant, appelée après l'initialisation du composant.
  ngOnInit(): void {
    this.loadUsers(); // Charge la liste des utilisateurs
    this.loadRooms(); // Charge la liste des locaux
    this.loadReservations(); // Charge la liste des réservations
  }

  // Fonction pour charger les réservations depuis le service
  loadReservations() {
    this.reservationService.getReservations().subscribe(
      (reservations) => {
        this.reservations = reservations; // Assignation des réservations reçues
        this.pending = this.reservations.filter(res => res.status === 'PENDING'); // Filtrage pour obtenir les réservations en attente
      },
      (error) => {
        console.error('Error fetching reservations:', error); // Gestion des erreurs lors de la récupération des réservations
      }
    );
  }

  // Fonction pour charger les locaux depuis le service roomService
  loadRooms(): void {
    this.roomService.getRooms().subscribe(
      (data: Room_list[]) => {
        this.rooms = data; // Assignation des locaux reçus
      },
      (error) => {
        console.error('Error fetching rooms', error); // Gestion des erreurs lors de la récupération des locaux
      }
    );
  }

  // Fonction pour charger les utilisateurs depuis le service userService
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data: User_list[]) => {
        this.users = data; // Assignation des utilisateurs reçus
      },
      (error) => {
        console.error('Error fetching users', error); // Gestion des erreurs lors de la récupération des utilisateurs
      }
    );
  }

  // Fonction pour récupérer le nom complet d'un utilisateur à partir de son ID
  getUserName(userId: number): string {
    const user = this.users.find(user => user.personneId == userId); // Recherche de l'utilisateur par ID
    return user?.nom + " " + user?.prenom; // Retourne le nom et prénom de l'utilisateur trouvé
  }

  // Fonction pour récupérer le nom d'un local à partir de son ID
  getLocalName(localId: number): string | undefined {
    const room = this.rooms.find(r => r.idLocal == localId); // Recherche du local par ID
    return room?.nom; // Retourne le nom du local trouvé
  }

  // Fonction pour convertir une heure au format "HH:MM:SS" en minutes totales
  private convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number); // Séparation des heures et minutes et conversion en nombre
    return hours * 60 + minutes; // Calcul des minutes totales
  }

  // Fonction pour vérifier si deux réservations se chevauchent dans le temps
  private timesOverlap(res1: ReservationList, res2: ReservationList): boolean {
    const res1Start = this.convertToMinutes(res1.startTime); // Conversion de l'heure de début de res1 en minutes
    const res1End = this.convertToMinutes(res1.endTime); // Conversion de l'heure de fin de res1 en minutes

    const res2Start = this.convertToMinutes(res2.startTime); // Conversion de l'heure de début de res2 en minutes
    const res2End = this.convertToMinutes(res2.endTime); // Conversion de l'heure de fin de res2 en minutes

    return res1Start < res2End && res2Start < res1End; // Condition de chevauchement temporel
  }

  // Fonction pour vérifier si une réservation donnée chevauche d'autres réservations existantes
  isOverlapping(reservation: ReservationList): boolean {
    return this.reservations.some(other =>
      other.id !== reservation.id &&  // Exclut la réservation actuelle de la vérification de chevauchement avec elle-même
      other.localId === reservation.localId &&  // Vérifie si le local est le même
      other.date === reservation.date &&  // Vérifie si la date est la même
      this.timesOverlap(reservation, other) // Vérifie le chevauchement temporel en utilisant la fonction timesOverlap
    );
  }

  // Fonction pour rejeter les réservations en attente qui chevauchent une réservation approuvée
  rejectOverlappingReservations(reservation: ReservationList): void {
    const overlappingReservations = this.pending.filter(other =>
      other.id !== reservation.id &&
      other.localId === reservation.localId &&
      other.date === reservation.date &&
      this.timesOverlap(reservation, other)
    );
    console.log(overlappingReservations); // Log des réservations qui se chevauchent (pour débogage)
    overlappingReservations.forEach(overlappingReservation => {
      this.rejectReservation(overlappingReservation.id); // Rejet de chaque réservation chevauchante
    });

    this.reservations = this.reservations.map(other => {
      if (overlappingReservations.some(overlap => overlap.id === other.id)) {
        return { ...other, status: 'REJECTED' }; // Mise à jour du statut des réservations chevauchantes dans la liste principale
      }
      return other; // Retourne la réservation inchangée si elle ne chevauche pas
    });
  }

  // Fonction pour accepter une réservation et mettre à jour son statut à "APPROVED"
  acceptReservation(reservationID: number): void {
    this.reservationService.changeStatus(reservationID, "APPROVED").subscribe(
      () => {
      },
      (error) => {
        console.error('Error updating status:', error); // Gestion des erreurs lors de la mise à jour du statut
        // Gérer l'erreur de manière appropriée (affichage d'un message d'erreur, etc.)
      }
    );

    // Mise à jour du statut dans la liste 'pending' pour refléter l'acceptation côté client immédiatement
    this.pending = this.pending.map(res => {
      if (res.id === reservationID) {
        return { ...res, status: "APPROVED" }; // Création d'un nouvel objet réservation avec le statut mis à jour
      }
      return res; // Retourne la réservation inchangée si l'ID ne correspond pas
    });

    // Recherche de la réservation acceptée dans la liste 'pending'
    const foundReservation = this.pending.find(res => res.id == reservationID);
    // Si la réservation est trouvée, rejeter les réservations chevauchantes
    foundReservation && this.rejectOverlappingReservations(foundReservation);
  }

  // Fonction pour rejeter une réservation et mettre à jour son statut à "REJECTED"
  rejectReservation(reservationID: number) {
    this.reservationService.changeStatus(reservationID, "REJECTED").subscribe(
      () => {
      },
      (error) => {
        console.error('Error updating status:', error); // Gestion des erreurs lors de la mise à jour du statut
        // Gérer l'erreur de manière appropriée
      }
    );

    // Mise à jour du statut dans la liste 'pending' pour refléter le rejet côté client immédiatement
    this.pending = this.pending.map(res => {
      if (res.id === reservationID) {
        return { ...res, status: "REJECTED" }; // Création d'un nouvel objet réservation avec le statut mis à jour
      }
      return res; // Retourne la réservation inchangée si l'ID ne correspond pas
    });
  }

  // Fonction pour calculer la durée d'une réservation et la formater (ex: "1h 30min")
  calculateDuration(reservation: any): string {
    const start = reservation.startTime; // Heure de début de la réservation
    const end = reservation.endTime; // Heure de fin de la réservation

    // Conversion des chaînes de caractères en objets Date pour le calcul de la durée
    const startDate = new Date(`1970-01-01T${start}`);
    const endDate = new Date(`1970-01-01T${end}`);

    // Calcul de la durée en minutes
    const durationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);

    // Conversion de la durée en heures et minutes
    const hours = Math.floor(durationMinutes / 60); // Obtention du nombre d'heures entières
    const minutes = durationMinutes % 60; // Obtention du reste en minutes

    // Formatage du résultat en chaîne de caractères lisible
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`; // Retourne "Xh Ymin" si heures et minutes sont présentes
    } else if (hours > 0) {
      return `${hours}h`; // Retourne "Xh" si seulement des heures
    } else {
      return `${minutes}min`; // Retourne "Ymin" si seulement des minutes
    }
  }
}