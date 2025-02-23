// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashComponent } from './components/admin-dash/admin-dash.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { FixedResComponent } from './components/fixed-res/fixed-res.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { UserDashComponent } from './components/user-dash/user-dash.component';

export const routes: Routes = [

  { path: 'rooms', component: RoomListComponent },
  
 // { path: 'users', component: ManageUserComponent },
  { path: 'admin-dash', component: AdminDashComponent,
    children: [
      { path: 'users', component: ManageUserComponent },
      { path: 'reservations', component: ReservationComponent },
      { path: 'fixedres', component: FixedResComponent },
      { path: 'classrooms', component: RoomListComponent },
       { path: 'dashboard', component: AnalyticsComponent}

    ]
   },
   {path: 'user-dash', component: UserDashComponent},
   {path: 'login', component: LoginComponent},
   {path: '**', component: LoginComponent}
];