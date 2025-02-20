import { Component } from '@angular/core';
import { roomlistservice, Room_list } from '../../services/room-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationList,reservationService } from '../../services/reservation.service';
import { User_list,UserService } from '../../services/user_list.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
@Component({
  selector: 'app-user-reservations',
  imports: [CommonModule,FullCalendarModule,FormsModule],
  templateUrl: './user-reservations.component.html',
  styleUrl: './user-reservations.component.css'
})
export class UserReservationsComponent {



  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    height: '100%',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '18:00:00',
    allDaySlot: false,
    weekends: true,
    events: [],
    eventClick: this.handleEventClick.bind(this)
  };

  handleDateClick(arg:any) {
    alert('date click! ' + arg.dateStr)
  }

  handleEventClick(info: any) {
    alert(`Event: ${info.event.title}`);
  }

  reservations : ReservationList[]=[
    {
      "id_reservation": 1,
      "id_utilisateur": 19,
      "id_local": 5,
      "date_reservation": "2025-02-19",
      "start_time": "08:00:00",
      "end_time": "10:01:00",
      "duree": 4,
      "status": "APPROVED"
    },
    {
      "id_reservation": 2,
      "id_utilisateur": 18,
      "id_local": 5,
      "date_reservation": "2025-02-20",
      "start_time": "10:00:00",
      "end_time": "13:00:00",
      "duree": 3,
      "status": "PENDING"
    },
    {
      "id_reservation": 3,
      "id_utilisateur": 12,
      "id_local": 12,
      "date_reservation": "2025-02-21",
      "start_time": "08:45:00",
      "end_time": "17:45:00",
      "duree": 1,
      "status": "APPROVED"
    }
  ];

  onRoomChange() {
    if (!this.selectedRoomId) return;
    // Filter reservations for selected room
    // .filter(res => res.id_local === Number(this.selectedRoomId))
    const roomEvents = this.reservations.map(reservation => ({
      title: `Reservation #${reservation.id_reservation}`,
      start: `${reservation.date_reservation}T${reservation.start_time}`,
      end: `${reservation.date_reservation}T${reservation.end_time}`,
      id: reservation.id_reservation.toString(),
      color: this.getStatusColor(reservation.status) // Assign colors based on status
    }));
      console.log(+JSON.stringify(roomEvents));
    // Update calendar events
    this.calendarOptions.events = roomEvents;

  
  }

  private getStatusColor(status: 'PENDING' | 'APPROVED' | 'REJECTED'|'FIXED'): string {
    const colors = {
      PENDING: '#FFA500',  // Orange
      APPROVED: '#4CAF50', // Green
      REJECTED: '#F44336',  // Red
      FIXED :'#2a272e5c' // gray
    };
    return colors[status];
  }




  selectedRoomId: number = 5;
  localIds:number[]=[];
  pending:ReservationList[]=[];
  rooms: Room_list[] = [];
  users:User_list[]=[];
  constructor(private snackBar: MatSnackBar, private roomService: roomlistservice,private userService: UserService,private reservationService:reservationService) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRooms();
    this.loadReservations();
    this.findPending();
  }




  loadReservations() {
    ///add code later for now it's hardcoded
    this.localIds=this.reservations.map(reservation => reservation.id_local);
    console.log(this.localIds);
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe(
      (data: Room_list[]) => {
        this.rooms = data;
        
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

  findPending(){
    
    this.pending=this.reservations.filter(res => res.status==='PENDING');

  }
  getUserName(userId:number):string{
    const user = this.users.find(user => user.personneId == userId );
    return user?.nom+" "+user?.prenom ;
  }

  getLocalName(localId:number):string|undefined{
    const room = this.rooms.find(r => r.idLocal == localId );
    return room?.nom ;
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
  
  acceptReservation(){}
  rejectReservation(){}

  // selectLocal(local: number) {
  //   this.selectedLocal = local;
  // }

}
