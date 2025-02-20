// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashComponent } from './components/admin-dash/admin-dash.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { RoomListComponent } from './components/room-list/room-list.component';
export const routes: Routes = [

  { path: 'rooms', component: RoomListComponent },
 // { path: 'users', component: ManageUserComponent },
  { path: 'admin-dash', component: AdminDashComponent,
    children: [
      { path: 'users', component: ManageUserComponent },
      { path: 'classrooms', component: RoomListComponent }

    ]
   },
];