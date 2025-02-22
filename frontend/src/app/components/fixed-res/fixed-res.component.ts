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


  isVisible: boolean = false;
  


  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    height: 'auto',
    headerToolbar: {
      left: '',
      center: 'title',
      right: ''
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '18:00:00',
    allDaySlot: false,
    weekends: true,
    events: [],
    eventClick: this.handleEventClick.bind(this),
    firstDay: 1, // Start from Monday (0 = Sunday, 1 = Monday, etc.)
    validRange: { start: '2025-02-17', end: '2025-02-24' }, // Forces a static week
    selectable: true,
    editable: false,
    eventContent: (arg) => {
      // Access extendedProps (person data in this case)
      const person = arg.event.extendedProps['person'] || 'Unknown person';
  
      return {
        html: `
          <div class="custom-event">
            <h4>${arg.event.title}</h4>
            <br>
            <p>Person: ${person}</p>
          </div>`
      };}
  };


  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr)
  }

  handleEventClick(info: any) {
    alert(`Event: ${info.event.title}`);
  }

  reservations: ReservationList[] = [
    {
      "id": 1,
      "personneId": 2,
      "localId": 5,
      "date": "2025-02-19",
      "startTime": "08:00:00",
      "endTime": "10:01:00",
      "status": "FIXED"
    },
    {
      "id": 2,
      "personneId": 1,
      "localId": 5,
      "date": "2025-02-10",
      "startTime": "10:00:00",
      "endTime": "13:00:00",
      "status": "FIXED"
    },
    {
      "id": 3,
      "personneId": 2,
      "localId": 3,
      "date": "2025-02-21",
      "startTime": "08:45:00",
      "endTime": "17:45:00",
      "status": "FIXED"
    }
  ];

  onRoomChange() {
    if (!this.selectedRoomId) return;
    // Filter reservations for selected room
    const roomEvents = this.reservations
      .filter(res => res.localId === Number(this.selectedRoomId))
      .filter(res => res.status === 'FIXED')
      .map(reservation => ({
        title: this.getTiltle(reservation.status),
        start: `${this.convertToCurrentWeek(reservation.date)}T${reservation.startTime}`,
        end: `${this.convertToCurrentWeek(reservation.date)}T${reservation.endTime}`,
        id: reservation.id.toString(),
        color: this.getStatusColor(reservation.status), // Assign colors based on status\
        extendedProps: {
          person: this.users.find(u => u.personneId == reservation.personneId)?.nom || 'unknown' // Adding the 'person' property here
        }
      }));
    console.log(JSON.stringify(this.users.find(u => u.personneId == 1)));
    // Update calendar events
    this.calendarOptions.events = roomEvents;
    //this.calendarOptions.eventContent='test content';


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

    const inputDayOfWeek = inputDate.getDay(); // Get the weekday (0=Sunday, 6=Saturday)
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay()); // Get the Sunday of the current week

    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + inputDayOfWeek); // Adjust to the same weekday in the current week

    return newDate.toISOString().split('T')[0]; // Return as 'YYYY-MM-DD'
  }



  selectedRoomId: number | null = null;
  localIds: number[] = [];
  pending: ReservationList[] = [];
  rooms: Room_list[] = [];
  users: User_list[] = [];
  constructor(private snackBar: MatSnackBar, private roomService: roomlistservice, private userService: UserService, private reservationService: reservationService) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRooms();
    this.loadReservations();
    this.findPending();
    this.onRoomChange();
  }




  loadReservations() {
    ///add code later for now it's hardcoded
    this.localIds = this.reservations.map(reservation => reservation.localId);
    console.log(this.localIds);
  }

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

  findPending() {

    this.pending = this.reservations.filter(res => res.status === 'PENDING');

  }
  getUserName(userId: number): string {
    const user = this.users.find(user => user.personneId == userId);
    return user?.nom + " " + user?.prenom;
  }

  getLocalName(localId: number): string | undefined {
    const room = this.rooms.find(r => r.idLocal == localId);
    return room?.nom;
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

    console.log(res1Start < res2End && res2Start < res1End);
    return res1Start < res2End && res2Start < res1End; // Overlapping condition
  }

  // Convert "HH:MM:SS" time string to total minutes
  private convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  acceptReservation() { }
  rejectReservation() { }

  // selectLocal(local: number) {
  //   this.selectedLocal = local;
  // }



}
