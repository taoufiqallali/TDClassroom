import { Component } from '@angular/core';
import { AuthService } from './../../services/auth.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) {}
  username: string = '';
  ngOnInit() {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      if (currentUser && currentUser.username) {
        this.username = currentUser.username;
      } 
    } 
  }
  logout() {
    this.authService.logout();
  }
}
