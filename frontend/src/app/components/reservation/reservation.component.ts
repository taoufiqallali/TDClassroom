import { Component } from '@angular/core';
import { roomlistservice, Room_list } from '../../services/room-list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservationList,reservationService } from '../../services/reservation.service';
import { User_list,UserService } from '../../services/user_list.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation',
  imports: [CommonModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {

  reservations : ReservationList[]=[];
  pending:ReservationList[]=[];
  rooms: Room_list[] = [];
  users:User_list[]=[];
  constructor(private snackBar: MatSnackBar, private roomService: roomlistservice,private userService: UserService,private reservationService:reservationService) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRooms();
    this.loadReservations();

  }


  loadReservations() {
    this.reservationService.getReservations().subscribe(
      (reservations) => {
        this.reservations = reservations;
        this.pending=this.reservations.filter(res => res.status==='PENDING');
      },  
      (error) => {
        console.error('Error fetching reservations:', error);
      }
    );
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
  
  rejectOverlappingReservations(reservation: ReservationList): void {
    const overlappingReservations = this.pending.filter(other =>
      other.id !== reservation.id &&
      other.localId === reservation.localId &&
      other.date === reservation.date &&
      this.timesOverlap(reservation, other)
    );
    console.log(overlappingReservations);
    overlappingReservations.forEach(overlappingReservation => {
      this.rejectReservation(overlappingReservation.id);
    });
  
    this.reservations = this.reservations.map(other => {
      if (overlappingReservations.some(overlap => overlap.id === other.id)){
        return {...other, status: 'REJECTED'};
      }
      return other;
    });
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
  
  acceptReservation(reservationID:number):void{
    this.reservationService.changeStatus(reservationID, "APPROVED").subscribe(
      () => {
      },
      (error) => {
        console.error('Error updating status:', error);
        // Handle the error appropriately
      }
    );

    this.pending = this.pending.map(res => {
      if (res.id === reservationID) {
        return { ...res, status: "APPROVED" }; // Create a new object
      }
      return res;
    });

    const foundReservation = this.pending.find(res => res.id == reservationID); 
    foundReservation && this.rejectOverlappingReservations(foundReservation);

   

  }
  rejectReservation(reservationID:number){
    this.reservationService.changeStatus(reservationID, "REJECTED").subscribe(
      () => {
      },
      (error) => {
        console.error('Error updating status:', error);
        // Handle the error appropriately
      }
    );

    this.pending = this.pending.map(res => {
      if (res.id === reservationID) {
        return { ...res, status: "REJECTED" }; // Create a new object
      }
      return res;
    });  }

  calculateDuration(reservation: any): string {
    const start = reservation.startTime;
    const end = reservation.endTime;
  
    // Convert strings to Date objects
    const startDate = new Date(`1970-01-01T${start}`);
    const endDate = new Date(`1970-01-01T${end}`);
  
    // Calculate duration in minutes
    const durationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
  
    // Convert to hours and minutes
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
  
    // Format result
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  }
  

}
 

