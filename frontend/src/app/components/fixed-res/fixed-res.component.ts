import { Component } from '@angular/core';
import { roomlistservice, Room_list } from '../../services/room-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationList, reservationService } from '../../services/reservation.service';
import { User_list, UserService } from '../../services/user_list.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { ReservationFormComponent } from '../reservation-form/reservation-form.component';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';



@Component({
  selector: 'app-fixed-res',
  imports: [CommonModule, FullCalendarModule, FormsModule, ReservationFormComponent],
  templateUrl: './fixed-res.component.html',
  styleUrl: './fixed-res.component.css'
})
export class FixedResComponent {

  constructor(private snackBar: MatSnackBar, private roomService: roomlistservice, private userService: UserService, private reservationService: reservationService) { }

  //parametres passee a la formulaire
  resType: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FIXED' = 'FIXED'; 
  formTitle = 'create reservation'; 
  selectedRoomId: number | null = null;
  //tableau pour contenir les donnees importee de la base de donnees 
  rooms: Room_list[] = [];
  users: User_list[] = [];
  reservations: ReservationList[] = [];
  // visibilite du formulaire
  isVisible: boolean = false;
  // local visible au lancement de la page
  defaultRoom: number | undefined;
  

  ngOnInit(): void {
    this.loadUsers();
    this.loadRooms();
    this.loadReservations();
    this.onRoomChange(); //apporter les changement sur le calendrier

  }

// calendar options and updates
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], // Plugins utilisés par le calendrier
    initialView: 'timeGridWeek', // Vue initiale du calendrier (vue hebdomadaire par défaut)
    height: 'auto', // Hauteur du calendrier (automatique)
    headerToolbar: {
      left: 'prev,next today', // Boutons de navigation (précédent, suivant, aujourd'hui)
      center: 'title', // Titre du calendrier
      right: 'timeGridWeek,timeGridDay' // Options pour changer entre la vue hebdomadaire et journalière
    },
    slotMinTime: '08:00:00', // Heure de début des créneaux horaires
    slotMaxTime: '18:00:00', // Heure de fin des créneaux horaires
    allDaySlot: false, // Masquer le créneau "toute la journée"
    weekends: true, // Afficher les week-ends
    events: [], // Tableau des événements (sera rempli dynamiquement)
    eventClick: this.handleEventClick.bind(this), // Gestionnaire de clic sur un événement
    firstDay: 1, // Le lundi est le premier jour de la semaine
    selectable: true, // Permettre la sélection de créneaux horaires
    editable: false, // Désactiver l'édition des événements
    eventContent: (arg) => {
      // Contenu personnalisé des événements
      const person = arg.event.extendedProps['person'] || 'Personne inconnue';
      return {
        html: `
          <div class="custom-event">
            <h4>${arg.event.title}</h4>
            <p>Personne: ${person}</p>
          </div>`
      };
    }
  };

  handleEventClick(info: any) {
    // Gestionnaire de clic sur un événement du calendrier.
  
    const snackBarRef = this.snackBar.open('Voulez-vous supprimer cette réservation ?', 'Supprimer', {
      duration: 5000, // Durée d'affichage de la notification (5 secondes)
      horizontalPosition: 'center', // Position horizontale de la notification (centrée)
      verticalPosition: 'top', // Position verticale de la notification (en haut)
      panelClass: ['delete-snackbar'] // Classe CSS personnalisée pour la notification
    });
  
    snackBarRef.onAction().subscribe(() => {
      // S'abonne à l'action "Supprimer" de la notification.
      this.deleteReservation(parseInt(info.event.id.split("-")[0])); // Appelle la méthode pour supprimer la réservation en utilisant l'ID de l'événement.
    });
  }

  onRoomChange() {
    // Méthode pour mettre à jour le calendrier lors du changement de salle sélectionnée.
    if (!this.selectedRoomId) return; // Si aucune salle n'est sélectionnée, quitter la méthode.
  
    // Filtrer les réservations pour la salle sélectionnée.
    const roomEvents = this.reservations
      .filter(res => res.localId === Number(this.selectedRoomId)) // Filtrer par l'ID de la salle sélectionnée.
      .filter(res => res.status === 'FIXED' || res.status === 'APPROVED') // Filtrer les réservations approuvées ou fixes.
      .flatMap(reservation => {
        // Pour chaque réservation filtrée, générer les événements du calendrier.
        if (reservation.status === 'FIXED') {
          // Si la réservation est fixe, générer des événements pour la semaine actuelle, 10 semaines à l'avance et 5 semaines en arrière.
          const events = [];
          for (let i = -5; i <= 10; i++) {
            // Boucle de -5 semaines à +10 semaines.
            const startDate = this.addWeeks(this.convertToCurrentWeek(reservation.date), i); // Calculer la date de début de l'événement.
            const endDate = this.addWeeks(this.convertToCurrentWeek(reservation.date), i); // Calculer la date de fin de l'événement.
  
            events.push({
              title: this.getTiltle(reservation.status), // Définir le titre de l'événement.
              start: `${startDate}T${reservation.startTime}`, // Définir la date et l'heure de début de l'événement.
              end: `${endDate}T${reservation.endTime}`, // Définir la date et l'heure de fin de l'événement.
              id: `${reservation.id}-${i}`, // ID unique pour chaque événement dupliqué.
              color: this.getStatusColor(reservation.status), // Définir la couleur de l'événement en fonction du statut de la réservation.
              extendedProps: {
                person: (this.users.find(u => u.personneId == reservation.personneId)?.nom || 'unknown') + " " + (this.users.find(u => u.personneId == reservation.personneId)?.prenom || 'unknown') // Ajouter le nom de la personne à l'événement.
              }
            });
          }
          return events; // Retourner le tableau des événements générés.
        } else {
          // Si la réservation n'est pas fixe (par exemple, 'APPROVED'), générer un seul événement.
          return {
            title: this.getTiltle(reservation.status), // Définir le titre de l'événement.
            start: `${reservation.date}T${reservation.startTime}`, // Définir la date et l'heure de début de l'événement.
            end: `${reservation.date}T${reservation.endTime}`, // Définir la date et l'heure de fin de l'événement.
            id: reservation.id.toString(), // ID de la réservation.
            color: this.getStatusColor(reservation.status), // Définir la couleur de l'événement en fonction du statut de la réservation.
            extendedProps: {
              person: (this.users.find(u => u.personneId == reservation.personneId)?.nom || 'unknown') + " " + (this.users.find(u => u.personneId == reservation.personneId)?.prenom || 'unknown') // Ajouter le nom de la personne à l'événement.
            }
          };
        }
      });
  
    // Mettre à jour les événements du calendrier.
    this.calendarOptions.events = roomEvents;
  
    if (this.selectedRoomId !== null) {
      // Si une salle est sélectionnée, définir la salle par défaut.
      this.defaultRoom = this.selectedRoomId;
    }
  }

  closeItem() {
    // Ferme l'élément (par exemple, un formulaire ou une fenêtre modale).
    this.isVisible = false; // Masque l'élément en définissant isVisible sur false.
    // Délai pour permettre aux changements d'être appliqués dans la base de données.
    setTimeout(() => {
      this.loadReservations(); // Recharge les réservations après le délai.
    }, 500); // Délai de 500 millisecondes (0.5 seconde).
  }
  
  // Gestion des réservations
  deleteReservation(id: number) {
    // Supprime une réservation en utilisant son ID.
    this.reservationService.deleteReservation(id).subscribe({
      next: () => {
        // Gestion du succès de la suppression.
        this.snackBar.open('Réservation supprimée avec succès', 'Fermer', {
          duration: 3000, // Affiche une notification de succès pendant 3 secondes.
        });
        // Rafraîchit le calendrier après la suppression.
        setTimeout(() => {
          this.loadReservations(); // Recharge les réservations après le délai.
        }, 500); // Délai de 500 millisecondes (0.5 seconde).
      },
      error: (error) => {
        // Gestion de l'erreur lors de la suppression.
        this.snackBar.open('Échec de la suppression de la réservation', 'Fermer', {
          duration: 3000, // Affiche une notification d'erreur pendant 3 secondes.
        });
        console.error('Erreur lors de la suppression de la réservation:', error); // Affiche l'erreur dans la console.
      }
    });
  }

  //creating d'une reservation fixe
  add_reservation_FIXED() {
    this.loadReservations();
    this.formTitle = 'creer une reservation fixe';
    this.resType = 'FIXED';
    this.isVisible = !this.isVisible;
    this.loadReservations();

  }

   //creating d'une reservation d'une seule fois
  add_reservation_APPROVED() {
    this.loadReservations();
    this.formTitle = 'creer une reservation ';
    this.resType = 'APPROVED';
    this.isVisible = !this.isVisible;
    this.loadReservations();



  }



//loading

//loading des reservations
loadReservations() {
  this.reservationService.getReservations().subscribe(
    (reservations) => {
      this.reservations = reservations;
      this.onRoomChange();
    },
    (error) => {
      console.error('Error fetching reservations:', error);
    }
  );

}

//loading des locals
loadRooms(): void {
  this.roomService.getRooms().subscribe(
    (data: Room_list[]) => {
      this.rooms = data;
      this.selectedRoomId = data[0].idLocal;

    },
    (error) => {
      console.error('Error fetching rooms', error);
    }
  );
}

//loading des utilisateurs
loadUsers(): void {
  this.userService.getUsers().subscribe(
    (data: User_list[]) => {
      this.users = data;

    },
    (error) => {
      console.error('Error fetching users', error);
    }
  );
}


// support functions

//ajouter des semainese au reservations fixes
addWeeks(dateString: string, weeks: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + weeks * 7); 
  return date.toISOString().split('T')[0]; 
}

//titre des reservations
private getTiltle(status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FIXED'): string {
  const titles = {
    PENDING: 'En attente d\'approbation de l\'ADMIN',
    APPROVED: 'Réservation approuvée !',
    REJECTED: 'Rejeté par l\'ADMIN',
    FIXED: 'Réservation fixe'
  };
  return titles[status];
}

//couleurs des cartes de reservations
private getStatusColor(status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FIXED'): string {
  const colors = {
    PENDING: '#FFA500',  
    APPROVED: '#4CAF50', 
    REJECTED: '#F44336',  
    FIXED: '#2a272ed6' 
  };
  return colors[status];
}

//convertir la date des reservations fixes au jour courant
convertToCurrentWeek(dateStr: string): string {
  const inputDate = new Date(dateStr); 
  const today = new Date();
  const diff = (today.getDay() === 0 ? 7 : today.getDay()) - (inputDate.getDay() === 0 ? 7 : inputDate.getDay());
  const newDate = new Date()
  newDate.setDate(today.getDate() - diff);

  return newDate.toISOString().split('T')[0]; 
}


private convertToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// detection des reservations qui ont la meme date 
isOverlapping(reservation: ReservationList): boolean {
  return this.reservations.some(other =>
    other.id !== reservation.id &&  
    other.localId === reservation.localId &&  
    other.date === reservation.date &&  
    this.timesOverlap(reservation, other) 
  );
}

// detection des reservations qui ont la meme date 
private timesOverlap(res1: ReservationList, res2: ReservationList): boolean {
  const res1Start = this.convertToMinutes(res1.startTime);
  const res1End = this.convertToMinutes(res1.endTime);

  const res2Start = this.convertToMinutes(res2.startTime);
  const res2End = this.convertToMinutes(res2.endTime);


  return res1Start < res2End && res2Start < res1End; 
}

// produire une notification plus sylee que alert()
simple_notification(Message: string) {
  this.snackBar.open(Message, 'Close', {
    duration: 3000,
    verticalPosition: 'top',
    horizontalPosition: 'center'
  });
}
}
