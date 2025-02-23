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
      "id": 1,
      "personneId": 19,
      "localId": 5,
      "date": "2025-02-19",
      "startTime": "08:00:00",
      "endTime": "10:01:00",
      //"duree": 4,
      "status": "APPROVED"
    },
    {
      "id": 2,
      "personneId": 18,
      "localId": 5,
      "date": "2025-02-20",
      "startTime": "10:00:00",
      "endTime": "13:00:00",
      //"duree": 3,
      "status": "PENDING"
    },
    {
      "id": 3,
      "personneId": 12,
      "localId": 12,
      "date": "2025-02-21",
      "startTime": "08:45:00",
      "endTime": "17:45:00",
      //"duree": 1,
      "status": "APPROVED"
    }
  ];

  onRoomChange() {
    if (!this.selectedRoomId) return;
    // Filter reservations for selected room
    // .filter(res => res.localId === Number(this.selectedRoomId))
    const roomEvents = this.reservations.map(reservation => ({
      title: `Reservation #${reservation.id}`,
      start: `${reservation.date}T${reservation.startTime}`,
      end: `${reservation.date}T${reservation.endTime}`,
      id: reservation.id.toString(),
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
    this.localIds=this.reservations.map(reservation => reservation.localId);
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
  
  acceptReservation(){}
  rejectReservation(){}

  // selectLocal(local: number) {
  //   this.selectedLocal = local;
  // }

}
