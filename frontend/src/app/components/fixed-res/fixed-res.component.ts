import { Component } from '@angular/core';
import { roomlistservice, Room_list } from '../../services/room-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationList, reservationService } from '../../services/reservation.service';
import { User_list, UserService } from '../../services/user_list.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-fixed-res',
  imports: [CommonModule, FullCalendarModule, FormsModule],
  templateUrl: './fixed-res.component.html',
  styleUrl: './fixed-res.component.css'
})
export class FixedResComponent {




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
      "id_reservation": 1,
      "id_utilisateur": 2,
      "id_local": 5,
      "date_reservation": "2025-02-19",
      "start_time": "08:00:00",
      "end_time": "10:01:00",
      "duree": 4,
      "status": "FIXED"
    },
    {
      "id_reservation": 2,
      "id_utilisateur": 1,
      "id_local": 5,
      "date_reservation": "2025-02-10",
      "start_time": "10:00:00",
      "end_time": "13:00:00",
      "duree": 3,
      "status": "FIXED"
    },
    {
      "id_reservation": 3,
      "id_utilisateur": 2,
      "id_local": 3,
      "date_reservation": "2025-02-21",
      "start_time": "08:45:00",
      "end_time": "17:45:00",
      "duree": 1,
      "status": "FIXED"
    }
  ];

  onRoomChange() {
    if (!this.selectedRoomId) return;
    // Filter reservations for selected room
    const roomEvents = this.reservations
      .filter(res => res.id_local === Number(this.selectedRoomId))
      .filter(res => res.status === 'FIXED')
      .map(reservation => ({
        title: this.getTiltle(reservation.status),
        start: `${this.convertToCurrentWeek(reservation.date_reservation)}T${reservation.start_time}`,
        end: `${this.convertToCurrentWeek(reservation.date_reservation)}T${reservation.end_time}`,
        id: reservation.id_reservation.toString(),
        color: this.getStatusColor(reservation.status), // Assign colors based on status\
        extendedProps: {
          person: this.users.find(u => u.personneId == reservation.id_utilisateur)?.nom || 'unknown' // Adding the 'person' property here
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
    this.localIds = this.reservations.map(reservation => reservation.id_local);
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
      other.id_reservation !== reservation.id_reservation &&  // Exclude itself
      other.id_local === reservation.id_local &&  // Same location
      other.date_reservation === reservation.date_reservation &&  // Same date
      this.timesOverlap(reservation, other) // Check time overlap
    );
  }

  private timesOverlap(res1: ReservationList, res2: ReservationList): boolean {
    const res1Start = this.convertToMinutes(res1.start_time);
    const res1End = this.convertToMinutes(res1.end_time);

    const res2Start = this.convertToMinutes(res2.start_time);
    const res2End = this.convertToMinutes(res2.end_time);

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
