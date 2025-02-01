import { AdminHUDComponent } from '../admin-hud/admin-hud.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { roomlistservice,Room_list } from '../../services/room-list.service';
import { RoomFormComponent } from '../room-form/room-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-room-list',
  imports: [AdminHUDComponent,CommonModule,RoomFormComponent],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent {
  constructor(private snackBar: MatSnackBar,private roomService: roomlistservice) {}
  isVisible: boolean = false; 
  operation_type=0;
  rooms: Room_list[] = []; 
  selectedTabIndex: string='';  // Default to the first tab
  roomid='';


  // Example data for groupedData
  groupedData :Room_list[]=[];
  unitelist:string[]=[];

  // Method to select a tab
  selectTab(index: string): void {
    this.selectedTabIndex = index;
  }

close_form(){
  this.roomid='';
  this.operation_type=0;
  this.isVisible = false; // Hide when clicking outside
  this.loadRooms();
}

add_room(){
  this.roomid='';
  this.operation_type=0;
  this.isVisible = !this.isVisible; // Toggle visibility
  this.loadRooms();

}

edit_room(room: any) {
  console.log(room.roomid);
  this.roomid=room.idLocal;
  this.operation_type= 1;
  this.isVisible = !this.isVisible; // Toggle visibility
  this.loadRooms();
}

delete_room(room:any){

  
  this.roomService.deleteRoom(room).subscribe(
    (response) => {
      // Success: User deleted
      console.log('room deleted:', response);
      this.simple_notification(`room deleted! ✅`);
      this.loadRooms();
    },
    (error) => {
      // Error: Handle failure
      console.error('Error deleting user:', error);
      this.simple_notification(`error deleting user ❌`);
      this.loadRooms();
    }
  );

}


  ngOnInit(): void {
    this.loadRooms();
<<<<<<< HEAD
this.selectedTabIndex='fso'; // make it dynamic
=======
>>>>>>> 14b4b1e (added the the operations of reservation and equipement for the second time)
  }

  // Method to load rooms using the service
  loadRooms(): void {
    this.roomService.getRooms().subscribe(
      (data: Room_list[]) => {
        this.rooms = data;  // Store the fetched data in the rooms array
        this.groupedData=data;
        this.unitelist=[...new Set(data.map(item => item.uniteOrganisationNom))];
      },
      (error) => {
        console.error('Error fetching rooms', error);
      }
    );
  }


  simple_notification(Message:string){          
    this.snackBar.open(Message, 'Close', {
    duration: 3000,
    verticalPosition: 'top',
    horizontalPosition: 'center'
  });}


  confirmDeleteRoom(room: any) {
    const snackBarRef = this.snackBar.open('Are you sure you want to delete this room?', 'Yes', {
      duration: 5000, // The prompt will disappear after 5 seconds if no action
      panelClass: ['centered-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    // Listen for the 'Yes' action to delete the user
    snackBarRef.onAction().subscribe(() => {
      this.delete_room(room);
    });

    // Optionally, listen for the snack-bar closing automatically (i.e., 'No' or after timeout)
    snackBarRef.afterDismissed().subscribe(() => {
      console.log('User deletion prompt dismissed');
    });
  }
}



