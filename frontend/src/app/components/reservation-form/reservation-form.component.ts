import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Room_list, roomlistservice } from '../../services/room-list.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { User_list, UserService } from '../../services/user_list.service';
import { ReservationList, reservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-reservation-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent {
  constructor(
    private http: HttpClient,
    private roomlistservice: roomlistservice,
    private UserService: UserService,
    private reservationService: reservationService
  ) {}

  // Propriétés d'entrée et de sortie
  @Input() resStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FIXED';
  @Input() title?: string;
  @Input() defaultRoom?: number;
  @Output() triggercloseItem = new EventEmitter<void>();
  @Output() triggersimple_notification = new EventEmitter<string>();

  // Variables d'état
  isEditMode = false; // Mode édition (true si modification d'une réservation existante)
  errorMessage: string | null = null;
  submitted = false;

  // Données
  rooms: Room_list[] = [];
  reservations: ReservationList[] = [];
  users: User_list[] = [];
  activeRes: ReservationList[] = [];

  // Réservation actuelle
  currReservation: ReservationList = {
    id: 0,
    localId: 0,
    personneId: 0,
    date: '',
    startTime: '',
    endTime: '',
    status: 'PENDING'
  };

  // Méthode d'initialisation
  ngOnInit(): void {
    if (this.resStatus !== undefined) {
      this.currReservation.status = this.resStatus;
    }
    this.loadRooms();
    this.loadUsers();
    this.loadReservations();

    if (this.defaultRoom !== undefined) {
      this.currReservation.localId = this.defaultRoom;
    }
  }

  // Méthode pour soumettre le formulaire
  onSubmit(form: NgForm): void {
    this.submitted = true;
    if (form.invalid) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    this.currReservation.localId = Number(this.currReservation.localId);
    this.currReservation.personneId = Number(this.currReservation.personneId);

    // Vérifications de disponibilité
    if (!this.checkAvailability(this.currReservation)) {
      this.errorMessage = 'Room busy at that time';
      return;
    }

    if (!this.checkUserAvailability(this.currReservation)) {
      this.errorMessage = 'User busy at that time';
      return;
    }

    if (!this.isTimeBefore(this.currReservation.startTime, this.currReservation.endTime)) {
      this.errorMessage = 'Start and End time not valid';
      return;
    }

    if (!(this.isTimeWithinRange(this.currReservation.startTime, '08:00', '18:00') &&
          this.isTimeWithinRange(this.currReservation.endTime, '08:00', '18:00'))) {
      this.errorMessage = 'Start and End time must be between 8 and 18';
      return;
    }

    // Création de la réservation
    this.createReservation(this.currReservation);
    this.simple_notification('Reservation created successfully');
    this.self_close();

    this.errorMessage = null;
  }

  // Méthode pour réinitialiser le formulaire
  resetForm(): void {
    this.currReservation = {
      id: 0,
      personneId: 0,
      localId: 0,
      date: '',
      startTime: '',
      endTime: '',
      status: 'PENDING'
    };
    this.submitted = false;
    this.errorMessage = null;
  }

  // Méthodes de chargement des données
  loadRooms(): void {
    this.roomlistservice.getRooms().subscribe(
      (data: Room_list[]) => {
        this.rooms = data;
      },
      (error) => {
        console.error('Error fetching rooms', error);
      }
    );
  }

  loadUsers(): void {
    this.UserService.getUsers().subscribe(
      (data: User_list[]) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  loadReservations(): void {
    this.reservationService.getReservations().subscribe(
      (reservations) => {
        this.reservations = reservations;
        this.activeRes = this.reservations.filter(res => res.status === 'APPROVED' || res.status === 'FIXED');
      },
      (error) => {
        console.error('Error fetching reservations:', error);
      }
    );
  }

  // Méthodes de vérification de disponibilité
  checkAvailability(reservation: ReservationList): boolean {
    return !this.isOverlapping(reservation);
  }

  checkUserAvailability(reservation: ReservationList): boolean {
    return !this.isUserOverlapping(reservation);
  }

  isOverlapping(reservation: ReservationList): boolean {
    if (reservation.status === 'APPROVED' || reservation.status === 'PENDING') {
      return this.reservations.some(other =>
        other.id !== reservation.id &&
        other.localId == reservation.localId &&
        (other.status === 'FIXED' ? this.timesOverlap(reservation, other) && this.checkIfSameDay(reservation.date, other.date) : other.date === reservation.date && this.timesOverlap(reservation, other))
      );
    } else {
      return this.reservations.some(other =>
        other.id !== reservation.id &&
        other.localId == reservation.localId &&
        (this.timesOverlap(reservation, other) && this.checkIfSameDay(reservation.date, other.date))
      );
    }
  }

  isUserOverlapping(reservation: ReservationList): boolean {
    if (reservation.status === 'APPROVED' || reservation.status === 'PENDING') {
      return this.reservations.some(other =>
        other.id !== reservation.id &&
        other.personneId == reservation.personneId &&
        (other.status === 'FIXED' ? this.timesOverlap(reservation, other) && this.checkIfSameDay(reservation.date, other.date) : other.date === reservation.date && this.timesOverlap(reservation, other))
      );
    } else {
      return this.reservations.some(other =>
        other.id !== reservation.id &&
        other.personneId == reservation.personneId &&
        (this.timesOverlap(reservation, other) && this.checkIfSameDay(reservation.date, other.date))
      );
    }
  }

  // Méthodes utilitaires
  checkIfSameDay(reservation: string, other: string): boolean {
    const reservation_day = new Date(reservation);
    const other_day = new Date(other);
    return reservation_day.getDay() == other_day.getDay();
  }

  private timesOverlap(res1: ReservationList, res2: ReservationList): boolean {
    const res1Start = this.convertToMinutes(res1.startTime);
    const res1End = this.convertToMinutes(res1.endTime);
    const res2Start = this.convertToMinutes(res2.startTime);
    const res2End = this.convertToMinutes(res2.endTime);
    return res1Start < res2End && res2Start < res1End; // Condition de chevauchement
  }

  private convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  isTimeWithinRange(timeStr: string, startTime: string, endTime: string): boolean {
    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const timeInMinutes = timeToMinutes(timeStr);
    const startTimeInMinutes = timeToMinutes(startTime);
    const endTimeInMinutes = timeToMinutes(endTime);

    return startTimeInMinutes <= timeInMinutes && timeInMinutes <= endTimeInMinutes;
  }

  isTimeBefore(startTime: string, endTime: string): boolean {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    if (startHour > endHour) {
      return false;
    } else if (startHour === endHour && startMinute > endMinute) {
      return false;
    } else if (startHour === endHour && startMinute == endMinute) {
      return false;
    } else {
      return true;
    }
  }

  // Méthodes de gestion des réservations
  createReservation(reservation: ReservationList): void {
    this.reservationService.createReservation(this.currReservation).subscribe({
      next: (message) => {
        console.log('Reservation created successfully:', message);
      },
      error: (err) => {
        console.error('Failed to create Reservation:', err);
      }
    });
  }

  // Méthodes d'événements
  self_close(): void {
    this.triggercloseItem.emit(); // Émet un événement pour fermer le composant
  }

  simple_notification(message: string): void {
    this.triggersimple_notification.emit(message); // Émet un événement de notification
  }
}