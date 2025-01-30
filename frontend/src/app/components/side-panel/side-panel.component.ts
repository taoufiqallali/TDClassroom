import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DashButtonComponent } from '../dash-button/dash-button.component';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [
    // other modules
    MatIconModule,CommonModule,DashButtonComponent
  ],
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css']
})
export class SidePanelComponent {
  // Define the buttons you want in the side panel
  buttons = [
    { iconSrc: 'images/dash-icon.png', description: 'Dashboard', altsrc: 'dash-icon' },
    { iconSrc: 'images/room-icon.png', description: 'Gestion de classes', altsrc: 'room-icon' },
    { iconSrc: 'images/conflict-icon.png', description: 'Gestion de conflits', altsrc: 'conflict-icon' },
    { iconSrc: 'images/user-icon2.png', description: 'Gestion des utilisateurs', altsrc: 'user-icon' }
  ];

  constructor(private http: HttpClient) {}

  submitSelection(description: string) {
    const payload = { action: description };

    this.http.post('http://localhost:8080/api/actions', payload)
      .subscribe(response => {
        console.log('Action submitted:', response);
      });
  }
}
