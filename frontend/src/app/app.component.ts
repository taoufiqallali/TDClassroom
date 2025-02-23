import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { AdminDashComponent } from './components/admin-dash/admin-dash.component';
import { RouterOutlet } from '@angular/router';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { UserDashComponent } from './components/user-dash/user-dash.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,LoginComponent,AdminDashComponent,ManageUserComponent,AdminSidebarComponent, UserDashComponent],
  template:'<router-outlet></router-outlet>'

})
export class AppComponent {

}
