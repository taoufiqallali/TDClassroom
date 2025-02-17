import { AdminHUDComponent } from '../admin-hud/admin-hud.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { roomlistservice, Room_list } from '../../services/room-list.service';
import { RoomFormComponent } from '../room-form/room-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-room-list',
  imports: [AdminHUDComponent, CommonModule, RoomFormComponent],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent implements OnInit {
  constructor(private snackBar: MatSnackBar, private roomService: roomlistservice) {}

  isVisible: boolean = false;
  operation_type = 0;
  rooms: Room_list[] = [];
  selectedTabIndex: string = 'fso';  // Default to 'fso', make it dynamic if needed
  roomid = '';

  groupedData: Room_list[] = [];
  unitelist: string[] = [];

  selectTab(index: string): void {
    this.selectedTabIndex = index;
  }

  close_form() {
    this.roomid = '';
    this.operation_type = 0;
    this.isVisible = false;
    this.loadRooms();
  }

  add_room() {
    this.roomid = '';
    this.operation_type = 0;
    this.isVisible = !this.isVisible;
    this.loadRooms();
  }

  edit_room(room: any) {
    console.log(room.roomid);
    this.roomid = room.idLocal;
    this.operation_type = 1;
    this.isVisible = !this.isVisible;
    this.loadRooms();
  }

  delete_room(room: any) {
    this.roomService.deleteRoom(room).subscribe(
      (response) => {
        console.log('Room deleted:', response);
        this.simple_notification(`Room deleted! ✅`);
        this.loadRooms();
      },
      (error) => {
        console.error('Error deleting room:', error);
        this.simple_notification(`Error deleting room ❌`);
        this.loadRooms();
      }
    );
  }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe(
      (data: Room_list[]) => {
        this.rooms = data;
        this.groupedData = data;
        this.unitelist = [...new Set(data.map(item => item.uniteOrganisationNom))];
      },
      (error) => {
        console.error('Error fetching rooms', error);
      }
    );
  }

  simple_notification(Message: string) {
    this.snackBar.open(Message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  confirmDeleteRoom(room: any) {
    const snackBarRef = this.snackBar.open('Are you sure you want to delete this room?', 'Yes', {
      duration: 5000,
      panelClass: ['centered-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    snackBarRef.onAction().subscribe(() => {
      this.delete_room(room);
    });

    snackBarRef.afterDismissed().subscribe(() => {
      console.log('User deletion prompt dismissed');
    });
  }
}
