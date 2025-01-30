import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { AdminDashComponent } from './components/admin-dash/admin-dash.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { DashButtonComponent } from './components/dash-button/dash-button.component';
import { RouterOutlet } from '@angular/router';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { AdminHUDComponent } from './components/admin-hud/admin-hud.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,LoginComponent,AdminDashComponent,SidePanelComponent,DashButtonComponent,ManageUserComponent,AdminHUDComponent],
  template:'<router-outlet></router-outlet>'

})
export class AppComponent {

}
