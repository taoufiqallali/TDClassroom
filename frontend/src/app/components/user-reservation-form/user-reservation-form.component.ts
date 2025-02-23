import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Room_list, roomlistservice } from '../../services/room-list.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { User_list, UserService } from '../../services/user_list.service';
import { ReservationList, reservationService } from '../../services/reservation.service';

interface SearchCriteria {
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  accessibility: boolean;
  datashow: boolean;
  ecrantactile: boolean;
}


@Component({
  selector: 'app-user-reservation-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-reservation-form.component.html',
  styleUrl: './user-reservation-form.component.css'
})
export class UserReservationFormComponent {
  constructor(private http: HttpClient, private roomlistservice: roomlistservice, private UserService: UserService, private reservationService: reservationService) { }

  @Input() userId?: number;
  @Input() resStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FIXED';
  @Input() title?: string;
  @Input() defaultRoom?: number;
  @Output() triggercloseItem = new EventEmitter<void>();
  @Output() triggersimple_notification = new EventEmitter<string>();

  searchCriteria: SearchCriteria = {
    date: '',
    startTime: '',
    endTime: '',
    capacity: 1,
    accessibility: false,
    datashow: false,
    ecrantactile: false
  };



  showRoomSelection: boolean = false;
  isEditMode = false; // Set to true if editing an existing reservation
  errorMessage: string | null = null;
  submitted = false;


  rooms: Room_list[] = [];
  allRooms: Room_list[] = [];
  reservations: ReservationList[] = [];
  users: User_list[] = [];
  activeRes: ReservationList[] = [];


  currReservation: ReservationList = {
    id: 0,
    localId: 0,
    personneId: 0,
    date: '',
    startTime: '',
    endTime: '',
    status: 'PENDING'
  };

  ngOnInit(): void {
    if (this.resStatus !== undefined) {
      this.currReservation.status = this.resStatus;
    }
    if (this.userId !== undefined) {
      this.currReservation.personneId = this.userId;
    }
    this.loadUsers();
    this.loadReservations();
    this.loadRooms();


  }

  onSubmit(form: NgForm): void {

    //---------------------  add part to fit search criterea to currreservation
    this.submitted = true;
    if (form.invalid) {
      this.errorMessage = 'Please fill out all required fields.';
      this.showRoomSelection = false;
      this.rooms = [];
      return;
    }

    this.currReservation.localId = Number(this.currReservation.localId);
    this.currReservation.personneId = Number(this.currReservation.personneId);
    // Handle form submission (e.g., save reservation)
    if (!this.checkAvailability(this.currReservation)) {
      this.errorMessage = 'Room busy at that time';
      this.showRoomSelection = false;
      this.rooms = [];
      return;
    }

    if (!this.checkUserAvailability(this.currReservation)) {
      this.errorMessage = 'User busy at that time';
      this.showRoomSelection = false;
      this.rooms = [];
      return;
    } else { console.log('how ?') }

    if (!this.isTimeBefore(this.currReservation.startTime, this.currReservation.endTime)) {
      this.errorMessage = 'Start and End time not valid';
      this.showRoomSelection = false;
      this.rooms = [];
      return;
    };

    if (!(this.isTimeWithinRange(this.currReservation.startTime, '08:00', '18:00') && this.isTimeWithinRange(this.currReservation.endTime, '08:00', '18:00'))) {
      this.errorMessage = 'Start and End time must be between 8 and 18';
      this.showRoomSelection = false;
      this.rooms = [];
      return;
    }

    console.log(this.currReservation);
    this.createReservation(this.currReservation);
    this.simple_notification('reservation created successfully');
    this.self_close();


    this.errorMessage = null;
  }

  isTimeWithinRange(
    timeStr: string,
    startTime: string,
    endTime: string
  ): boolean {
    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const timeInMinutes = timeToMinutes(timeStr);
    const startTimeInMinutes = timeToMinutes(startTime);
    const endTimeInMinutes = timeToMinutes(endTime);

    return (
      startTimeInMinutes <= timeInMinutes && timeInMinutes <= endTimeInMinutes
    );
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
    }
    else {
      return true;
    }
  }


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
    this.searchCriteria = {
      date: '',
      startTime: '',
      endTime: '',
      capacity: 1,
      accessibility: false,
      datashow: false,
      ecrantactile: false
    };
    this.submitted = false;
    this.errorMessage = null;
    this.showRoomSelection = false;
    this.rooms = [];
  }

  loadRooms(): void {
    this.roomlistservice.getRooms().subscribe(
      (data: Room_list[]) => {
        this.allRooms = data;
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

  loadReservations() {
    this.reservationService.getReservations().subscribe(
      (reservations) => {
        this.reservations = reservations;
        this.activeRes = this.reservations.filter(res => res.status === 'APPROVED' || res.status === 'FIXED' || res.status === 'PENDING');
      },
      (error) => {
        console.error('Error fetching reservations:', error);
      }
    );
  }

  checkAvailability(reservation: ReservationList): Boolean {
    if (this.isOverlapping(reservation)) { return false; }

    return true;
  }
  checkUserAvailability(reservation: ReservationList): Boolean {
    if (this.isUserOverlapping(reservation)) { return false; }
    return true;
  }

  isOverlapping(reservation: ReservationList): boolean {
    if (reservation.status === 'APPROVED' || reservation.status === 'PENDING') {
      return this.reservations.some(other =>
        other.id !== reservation.id &&
        other.localId == reservation.localId &&
        (other.status === 'FIXED' ? this.timesOverlap(reservation, other) && this.checkIfSameDay(reservation.date, other.date) : other.date === reservation.date && this.timesOverlap(reservation, other))
      );
    }
    else {
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
    }
    else {
      return this.reservations.some(other =>
        other.id !== reservation.id &&
        other.personneId == reservation.personneId &&
        (this.timesOverlap(reservation, other) && this.checkIfSameDay(reservation.date, other.date))
      );

    }
  }

  checkIfSameDay(reservation: string, other: string): boolean {
    const reservation_day = new Date(reservation);
    const other_day = new Date(other);

    return (reservation_day.getDay() == other_day.getDay());

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


  self_close() {
    this.triggercloseItem.emit(); // Emit event when called
  }

  simple_notification(message: string) {

    this.triggersimple_notification.emit(message);

  }

  fetchAvailableRooms() {
    this.currReservation.date = this.searchCriteria.date;
    this.currReservation.startTime = this.searchCriteria.startTime;
    this.currReservation.endTime = this.searchCriteria.endTime;
    const invalidReservations = this.reservations.filter(reservation => {
      return reservation.status === 'FIXED'
        ? this.checkIfSameDay(reservation.date, this.currReservation.date) &&  this.timesOverlap(reservation, this.currReservation) 
        : this.checkIfSameDay(reservation.date, this.currReservation.date) && this.timesOverlap(reservation, this.currReservation) && reservation.date == this.currReservation.date; // Replace yourBooleanFunction
    });

    this.rooms = this.allRooms.filter(r =>
      !invalidReservations.find(res => res.localId == r.idLocal) &&
      r.capacite >= this.searchCriteria.capacity &&
      (!this.searchCriteria.accessibility || (r.accessibilitePmr.toString() === this.booleanToString(this.searchCriteria.accessibility))) &&
      (!this.searchCriteria.datashow || (r.datashow?.toString() === this.booleanToString(this.searchCriteria.datashow))) &&
      (!this.searchCriteria.ecrantactile || (r.ecranTactile?.toString() === this.booleanToString(this.searchCriteria.ecrantactile)))
    );

    this.showRoomSelection = true;

  }

  booleanToString(value: boolean): string {
    return value ? "true" : "false";
  }


}
