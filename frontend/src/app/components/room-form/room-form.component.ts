import { Component, Input, OnInit,EventEmitter, Output  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { roomlistservice } from '../../services/room-list.service';

interface Room{
  idLocal:number,
  nom: string,
  capacite: number,
  accessibilitePmr: string,
  uniteOrganisationNom:string,
}

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.css'
})
export class RoomFormComponent {
  @Input() roomid?: String;
room:Room={
  idLocal:0,
  nom: '',
  capacite: 0,
  accessibilitePmr: '',
  uniteOrganisationNom:'',
}
isEditMode = false;
submitted = false;
errorMessage = '';

constructor(private http: HttpClient,private roomlistservice: roomlistservice) {}

@Output() triggercloseItem = new EventEmitter<void>();
@Output() triggersimple_notification = new EventEmitter<string>();

self_close() {
  this.triggercloseItem.emit(); // Emit event when called
}

simple_notification(message:string){

  this.triggersimple_notification.emit(message);

}

ngOnInit() {

  if (this.roomid) {
    this.isEditMode = true;
    this.loadroom();
  }
}

loadroom() {
   
  this.http.get<Room>(`http://localhost:8080/api/locals/${this.roomid}`)
    .subscribe({
      next: (data) => {
        this.room = data;
      },
      error: (error) => {
        console.error('Error loading room:', error);
        this.errorMessage = 'Failed to load room data';
      }
    });
}

onSubmit(){


  this.submitted = true;
  this.errorMessage = '';

  if (this.isEditMode) {
    this.updateRoom();
  } else {
    this.createRoom();
  }
}

updateRoom(){
  this.roomlistservice.updateRoom(this.room.idLocal,this.room).subscribe({
    next: (message) => {
      console.log('room updated successfully:', message);
      // Handle success (e.g., show a success message or redirect)
      this.simple_notification(`room updated successfully! ✅`);
      this.self_close();
    },
    error: (err) => {
      console.error('Failed to update room:', err);
      // Handle error (e.g., show an error message)
      this.simple_notification(`❌ updating room. Please try again.`);
    }
  });




}

createRoom(){

  this.roomlistservice.createRoom(this.room).subscribe({
    next: (message) => {
      console.log('room created successfully:', message);
      // Handle success (e.g., show a success message or redirect)
      this.simple_notification(`room created successfully! ✅`);
      this.self_close();
    },
    error: (err) => {
      console.error('Failed to create user:', err);
      // Handle error (e.g., show an error message)
      this.simple_notification(`❌ Error creating room. Please try again.`);
      
    }
  });


}



resetForm() {

  this.room={
    idLocal:0,
    nom: '',
    capacite: 0,
    accessibilitePmr: '',
    uniteOrganisationNom:'',
  }
}
}
