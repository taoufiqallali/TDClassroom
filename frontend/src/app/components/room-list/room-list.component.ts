import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { roomlistservice, Room_list } from '../../services/room-list.service';
import { RoomFormComponent } from '../room-form/room-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-room-list',

  imports: [CommonModule, RoomFormComponent, FormsModule],


  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css',
})
export class RoomListComponent implements OnInit {

  constructor(private snackBar: MatSnackBar, private roomService: roomlistservice) {}
  // Propriétés du composant
  isVisible: boolean = false; // Contrôle la visibilité du formulaire
  operation_type = 0; // Type d'opération (0: ajout, 1: édition)
  rooms: Room_list[] = []; // Liste des salles
  selectedTabIndex: string = 'fso'; // Onglet sélectionné par défaut
  roomid = ''; // ID de la salle sélectionnée
  groupedData: Room_list[] = []; // Données groupées (non utilisé actuellement)
  unitelist: string[] = []; // Liste des unités (non utilisé actuellement)
  searchQuery: string = '';

  selectTab(index: string): void {
    this.selectedTabIndex = index;
  }

 

  add_room(): void {
    // Affiche le formulaire pour ajouter une nouvelle salle
    this.roomid = '';
    this.operation_type = 0;
    this.isVisible = !this.isVisible;
    this.loadRooms();
  }

  edit_room(room: any) {
    console.log(room.idLocal);
    this.roomid = room.idLocal;
    this.operation_type = 1;
    this.isVisible = !this.isVisible;
    this.loadRooms();
  }

  delete_room(room: any): void {
    // Supprime une salle via le service
    this.roomService.deleteRoom(room).subscribe(
      (response) => {
        console.log('Salle supprimée:', response);
        this.simple_notification(`Salle supprimée ! ✅`);
        this.loadRooms();
      },
      (error) => {
        console.error('Erreur lors de la suppression de la salle:', error);
        this.simple_notification(`Erreur lors de la suppression de la salle ❌`);
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
        this.filterRooms();
      },
      (error) => {
        console.error('Error fetching rooms', error);
      }
    );
  }

  filterRooms(): void {
    if (!this.searchQuery) {
      this.groupedData = this.rooms;
    } else {
      const searchTerm = this.searchQuery.toLowerCase();
      this.groupedData = this.rooms.filter(room => 
        room.nom.toLowerCase().includes(searchTerm)
      );
    }
  }

  onSearchChange(): void {
    this.filterRooms();
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
      this.delete_room(room); // Supprime la salle si l'utilisateur confirme
    });

    snackBarRef.afterDismissed().subscribe(() => {
      console.log('Room deletion prompt dismissed');
    });
  }

  close_form(): void {
    // Ferme le formulaire et recharge la liste des salles
    this.roomid = '';
    this.operation_type = 0;
    this.isVisible = false;
    this.loadRooms();
  }
}