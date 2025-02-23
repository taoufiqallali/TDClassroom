import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { roomlistservice } from '../../services/room-list.service';

// Updated Room interface to include new fields
interface Room {
  idLocal: number;
  nom: string;
  capacite: number;
  accessibilitePmr: boolean; // Changed from string to boolean
  uniteOrganisationNom: string;
  datashow: boolean; // New field
  ecranTactile: boolean; // New field
}

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.css'
})
export class RoomFormComponent implements OnInit {
  @Input() roomid?: string; // Ensure roomid is a string
  room: Room = {
    idLocal: 0,
    nom: '',
    capacite: 0,
    accessibilitePmr: false, // Default value for boolean fields
    uniteOrganisationNom: '',
    datashow: false, // Default value for datashow
    ecranTactile: false // Default value for ecranTactile
  };

  isEditMode = false;
  submitted = false;
  errorMessage = '';

  constructor(private http: HttpClient, private roomlistservice: roomlistservice) {}

  @Output() triggercloseItem = new EventEmitter<void>();
  @Output() triggersimple_notification = new EventEmitter<string>();

  self_close() {
    this.triggercloseItem.emit(); // Emit event when called
  }

  simple_notification(message: string) {
    this.triggersimple_notification.emit(message);
  }

  ngOnInit() {
    if (this.roomid) {
      this.isEditMode = true;
      this.loadroom();
    }
  }

  loadroom() {
    if (this.roomid) {
      this.http.get<Room>(`http://localhost:8080/api/locals/${this.roomid}`).subscribe({
        next: (data) => {
          this.room = data;
        },
        error: (error) => {
          console.error('Error loading room:', error);
          this.errorMessage = 'Failed to load room data';
        }
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    if (this.isEditMode) {
      this.updateRoom();
    } else {
      this.createRoom();
    }
  }

  updateRoom() {
    this.roomlistservice.updateRoom(this.room.idLocal, this.room).subscribe({
      next: (message) => {
        console.log('Room updated successfully:', message);
        this.simple_notification(`Room updated successfully! ✅`);
        this.self_close();
      },
      error: (err) => {
        console.error('Failed to update room:', err);
        this.simple_notification(`❌ Updating room failed. Please try again.`);
      }
    });
  }

  createRoom() {
    this.roomlistservice.createRoom(this.room).subscribe({
      next: (message) => {
        console.log('Room created successfully:', message);
        this.simple_notification(`Room created successfully! ✅`);
        this.self_close();
      },
      error: (err) => {
        console.error('Failed to create room:', err);
        this.simple_notification(`❌ Error creating room. Please try again.`);
      }
    });
  }

  resetForm() {
    this.room = {
      idLocal: 0,
      nom: '',
      capacite: 0,
      accessibilitePmr: false,
      uniteOrganisationNom: '',
      datashow: false,
      ecranTactile: false
    };
    this.submitted = false;
  }
}