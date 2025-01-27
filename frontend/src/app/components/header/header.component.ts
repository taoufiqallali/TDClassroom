import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports:[CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentDate: Date = new Date();
  dropdownVisible: boolean = false;
  username: string = ''; // Fetched from backend

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Update the time and date every second
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);

    // Fetch the username from the backend
    this.http.get<{ username: string }>('/api/user').subscribe({
      next: (data) => {
        this.username = data.username;
      },
      error: (err) => {
        console.error('Error fetching username:', err);
      }
    });
  }

  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  disconnect(event: Event): void {
    event.stopPropagation(); // Prevent dropdown closing when clicking the button

    this.http.post('/api/logout', {}).subscribe({
      next: () => {
        console.log('User disconnected');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error during logout:', err);
      }
    });
  }
}
