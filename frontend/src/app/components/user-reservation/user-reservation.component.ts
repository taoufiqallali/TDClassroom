import { Component } from '@angular/core';
import { roomlistservice, Room_list } from '../../services/room-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationList, reservationService } from '../../services/reservation.service';
import { User_list, UserService } from '../../services/user_list.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { UserReservationFormComponent } from '../user-reservation-form/user-reservation-form.component';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


@Component({
  selector: 'app-user-reservation',
  imports: [CommonModule, FullCalendarModule, FormsModule, UserReservationFormComponent],
  templateUrl: './user-reservation.component.html',
  styleUrl: './user-reservation.component.css'
})
export class UserReservationComponent {


  // Constructeur du composant
  constructor(
    private snackBar: MatSnackBar, // Service pour afficher des notifications (snackbar)
    private roomService: roomlistservice, // Service pour gérer les salles
    private userService: UserService, // Service pour gérer les utilisateurs
    private reservationService: reservationService // Service pour gérer les réservations
  ) { }

  // Propriétés du composant
  resType: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FIXED' = 'FIXED'; // Type de réservation (par défaut : 'FIXED')
  formTitle = 'create reservation'; // Titre du formulaire de réservation
  selectedRoomId: number | null = null; // ID de la salle sélectionnée (initialisé à null)
  rooms: Room_list[] = []; // Liste des salles disponibles
  users: User_list[] = []; // Liste des utilisateurs disponibles
  userId: number | undefined; // ID de l'utilisateur actuel (peut être undefined)
  isVisible: boolean = false; // Contrôle la visibilité du formulaire de réservation
  defaultRoom: number | undefined; // ID de la salle par défaut (peut être undefined)
  reservations: ReservationList[] = []; // Liste des réservations
  username:string|undefined;

  ngOnInit(): void {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      if (currentUser && currentUser.username) {
        this.username = currentUser.username;
      } 
    } 

    this.loadUsers();
    this.loadRooms();
    this.loadReservations();
    this.onRoomChange();// pour apporter les changement sur le calendireir
  }
  // Fermer le formulaire
  closeItem() {
    this.isVisible = false; // Masquer le formulaire

    // Délai pour permettre aux changements de s'appliquer dans la base de données
    setTimeout(() => {
      this.loadReservations(); // Recharger les réservations après un délai de 500 ms
    }, 500);
  }

  // Gestion du calendrier
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], // Plugins pour les fonctionnalités du calendrier
    initialView: 'timeGridWeek', // Vue par défaut : semaine
    height: 'auto', // Hauteur automatique
    headerToolbar: {
      left: 'prev,next today', // Boutons de navigation (précédent, suivant, aujourd'hui)
      center: 'title', // Titre du calendrier au centre
      right: 'timeGridWeek,timeGridDay' // Boutons pour basculer entre la vue semaine et jour
    },
    slotMinTime: '08:00:00', // Heure de début du calendrier (8h)
    slotMaxTime: '18:00:00', // Heure de fin du calendrier (18h)
    allDaySlot: false, // Masquer le créneau "toute la journée"
    weekends: true, // Afficher les week-ends
    events: [], // Événements à afficher (remplis dynamiquement)
    eventClick: this.handleEventClick.bind(this), // Gestionnaire d'événement pour les clics sur les événements
    firstDay: 1, // Premier jour de la semaine : lundi
    selectable: true, // Permettre la sélection de créneaux horaires
    editable: false, // Désactiver l'édition des événements
    eventContent: (arg) => {
      // Contenu personnalisé des événements
      const person = arg.event.extendedProps['person'] || 'Personne inconnue'; // Nom de la personne
      const room = arg.event.extendedProps['room'] || 'Salle inconnue'; // Nom de la salle
      return {
        html: `
        <div class="custom-event">
          <h4>${arg.event.title}</h4> <!-- Titre de l'événement -->
          <p>Personne: ${person}</p> <!-- Nom de la personne -->
          <p>Salle: ${room}</p> <!-- Nom de la salle -->
        </div>`
      };
    }
  };

  // Gestion du clic sur un événement du calendrier

  handleEventClick(info: any) {
    if (info.event.title === 'fixed reservation') {
      // Si l'événement est une réservation fixe
      this.simple_notification('Réservation fixe'); // Afficher une notification
    } else {
      // Sinon, demander confirmation pour supprimer la réservation
      const snackBarRef = this.snackBar.open('Voulez-vous supprimer cette réservation ?', 'Supprimer', {
        duration: 5000, // Durée de la notification : 5 secondes
        horizontalPosition: 'center', // Position horizontale : centre
        verticalPosition: 'top', // Position verticale : haut
        panelClass: ['delete-snackbar'] // Classe CSS pour la notification
      });

      // Si l'utilisateur clique sur "Supprimer"
      snackBarRef.onAction().subscribe(() => {
        this.deleteReservation(parseInt(info.event.id.split("-")[0])); // Supprimer la réservation
      });
    }
  }

  onRoomChange() {
    // Si aucune salle n'est sélectionnée, on quitte la fonction
    if (!this.selectedRoomId) return;

    // Filtrer les réservations pour la salle sélectionnée
    const roomEvents = this.reservations
      .flatMap(reservation => {
        if (reservation.status === 'FIXED') {
          // Générer des événements pour la semaine actuelle, 10 semaines à venir et 5 semaines précédentes
          const events = [];
          for (let i = -5; i <= 10; i++) { // Boucle de -5 semaines à +10 semaines
            // Calculer les dates de début et de fin pour chaque semaine
            const startDate = this.addWeeks(this.convertToCurrentWeek(reservation.date), i);
            const endDate = this.addWeeks(this.convertToCurrentWeek(reservation.date), i);

            // Ajouter l'événement à la liste
            events.push({
              title: this.getTiltle(reservation.status), // Titre de l'événement basé sur le statut
              start: `${startDate}T${reservation.startTime}`, // Date et heure de début
              end: `${endDate}T${reservation.endTime}`, // Date et heure de fin
              id: `${reservation.id}-${i}`, // ID unique pour chaque événement dupliqué
              color: this.getStatusColor(reservation.status), // Couleur basée sur le statut
              extendedProps: {
                person: (this.users.find(u => u.personneId == reservation.personneId)?.nom || 'inconnu') + " " + (this.users.find(u => u.personneId == reservation.personneId)?.prenom || 'inconnu'), // Nom et prénom de la personne
                room: this.rooms.find(r => r.idLocal == reservation.localId)?.nom || 'inconnu' // Nom de la salle
              }
            });
          }
          return events;
        } else {
          // Pour les événements non fixes (par exemple, 'APPROVED')
          return {
            title: this.getTiltle(reservation.status), // Titre de l'événement basé sur le statut
            start: `${reservation.date}T${reservation.startTime}`, // Date et heure de début
            end: `${reservation.date}T${reservation.endTime}`, // Date et heure de fin
            id: reservation.id.toString(), // ID de la réservation
            color: this.getStatusColor(reservation.status), // Couleur basée sur le statut
            extendedProps: {
              person: (this.users.find(u => u.personneId == reservation.personneId)?.nom || 'inconnu') + " " + (this.users.find(u => u.personneId == reservation.personneId)?.prenom || 'inconnu'), // Nom et prénom de la personne
              room: this.rooms.find(r => r.idLocal == reservation.localId)?.nom || 'inconnu' // Nom de la salle
            }
          };
        }
      });

    // Mettre à jour les événements du calendrier
    this.calendarOptions.events = roomEvents;

    // Si une salle est sélectionnée, la définir comme salle par défaut
    if (this.selectedRoomId !== null) {
      this.defaultRoom = this.selectedRoomId;
    }
  }

  // Gestion des réservations

  // Supprimer une réservation
  deleteReservation(id: number) {
    this.reservationService.deleteReservation(id).subscribe({
      next: () => {
        // Gestion de la réussite
        this.snackBar.open('Réservation supprimée avec succès', 'Fermer', {
          duration: 3000, // Notification affichée pendant 3 secondes
        });

        // Recharger les réservations après un délai de 500 ms
        setTimeout(() => {
          this.loadReservations();
        }, 500);
      },
      error: (error) => {
        // Gestion des erreurs
        this.snackBar.open('Échec de la suppression de la réservation', 'Fermer', {
          duration: 3000, // Notification affichée pendant 3 secondes
        });
        console.error('Erreur lors de la suppression de la réservation :', error);
      }
    });
  }

  // Ajouter une réservation en statut "PENDING"
  add_reservation_PENDING() {
    this.loadReservations(); // Recharger les réservations
    this.formTitle = 'create pending reservation'; // Définir le titre du formulaire
    this.resType = 'PENDING'; // Définir le type de réservation à "PENDING"
    this.isVisible = !this.isVisible; // Basculer la visibilité du formulaire
    this.loadReservations(); // Recharger les réservations à nouveau
  }

  // Chargement des données

  // Charger les réservations
  loadReservations() {
    this.reservationService.getReservations().subscribe(
      (reservations) => {
        // Filtrer les réservations pour ne garder que celles de l'utilisateur actuel
        this.reservations = reservations.filter(r => r.personneId == this.userId);
        // Mettre à jour les événements du calendrier en fonction de la salle sélectionnée
        this.onRoomChange();
      },
      (error) => {
        // Gestion des erreurs en cas d'échec du chargement des réservations
        console.error('Erreur lors du chargement des réservations :', error);
      }
    );
  }

  // Charger les salles
  loadRooms(): void {
    this.roomService.getRooms().subscribe(
      (data: Room_list[]) => {
        // Mettre à jour la liste des salles disponibles
        this.rooms = data;
        // Sélectionner la première salle par défaut
        this.selectedRoomId = data[0].idLocal;
      },
      (error) => {
        // Gestion des erreurs en cas d'échec du chargement des salles
        console.error('Erreur lors du chargement des salles :', error);
      }
    );
  }

  // Charger les utilisateurs
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data: User_list[]) => {
        // Mettre à jour la liste des utilisateurs disponibles
        this.users = data;
        this.userId=this.users.find(u => u.email === this.username)?.personneId;
      },
      (error) => {
        // Gestion des erreurs en cas d'échec du chargement des utilisateurs
        console.error('Erreur lors du chargement des utilisateurs :', error);
      }
    );
  }

  //supporting functions
  simple_notification(Message: string) {
    this.snackBar.open(Message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  addWeeks(dateString: string, weeks: number): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + weeks * 7); // Add/subtract weeks
    return date.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
  }

  private getTiltle(status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FIXED'): string {
    const titles = {
      PENDING: 'Pending for ADMIN approval',  // Orange
      APPROVED: 'Approved reservation!', // Green
      REJECTED: 'Rejected by the ADMIN',  // Red
      FIXED: 'fixed reservation' // gray
    };
    return titles[status];
  }

  private getStatusColor(status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FIXED'): string {
    const colors = {
      PENDING: '#FFA500',  // Orange
      APPROVED: '#4CAF50', // Green
      REJECTED: '#F44336',  // Red
      FIXED: '#2a272ed6' // gray
    };
    return colors[status];
  }

  removeMiddaySlots() {
    setTimeout(() => {
      const slotsToHide = ["12:00:00", "12:30:00", "13:00:00", "13:30:00"];
      slotsToHide.forEach(time => {
        document.querySelectorAll(`.fc-timegrid-slot[data-time="${time}"]`).forEach(slot => {
          slot.parentElement?.classList.add("hidden");
        });
      });
    }, 100); // Slight delay to ensure DOM is rendered
  }


  convertToCurrentWeek(dateStr: string): string {
    const inputDate = new Date(dateStr); // Convert input string to Date object
    const today = new Date(); // Get current date
    const diff = (today.getDay() === 0 ? 7 : today.getDay()) - (inputDate.getDay() === 0 ? 7 : inputDate.getDay());
    const newDate = new Date()
    newDate.setDate(today.getDate() - diff);

    return newDate.toISOString().split('T')[0]; // Return as 'YYYY-MM-DD'
  }


  isOverlapping(reservation: ReservationList): boolean {
    return this.reservations.some(other =>
      other.id !== reservation.id &&  // Exclude itself
      other.localId === reservation.localId &&  // Same location
      other.date === reservation.date &&  // Same date
      this.timesOverlap(reservation, other) // Check time overlap
    );
  }

  private timesOverlap(res1: ReservationList, res2: ReservationList): boolean {
    const res1Start = this.convertToMinutes(res1.startTime);
    const res1End = this.convertToMinutes(res1.endTime);

    const res2Start = this.convertToMinutes(res2.startTime);
    const res2End = this.convertToMinutes(res2.endTime);


    return res1Start < res2End && res2Start < res1End; // Overlapping condition
  }

  // Convert "HH:MM:SS" time string to total minutes
  private convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }








}
