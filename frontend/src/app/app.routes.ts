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
import { UserReservationComponent } from './components/user-reservation/user-reservation.component';
import { UserAnalytics } from './components/user-analytics/user-analytics.component';
import { provideRouter, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const expectedRole = route.data['expectedRole'];
  const currentUserString = localStorage.getItem('currentUser');

  if (currentUserString) {
    const currentUser = JSON.parse(currentUserString);
    if (currentUser && currentUser.role === expectedRole) {
      return true;
    }
  }

  router.navigate(['/login']);
  return false;
};

export const routes: Routes = [
  { path: 'rooms', component: RoomListComponent },
  {
    path: 'admin-dash',
    component: AdminDashComponent,
    canActivate: [roleGuard],
    data: { expectedRole: 'ROLE_ADMIN' }, // Set expected role
    children: [
      { path: 'users', component: ManageUserComponent },
      { path: 'reservations', component: ReservationComponent },
      { path: 'fixedres', component: FixedResComponent },
      { path: 'classrooms', component: RoomListComponent },
      { path: 'dashboard', component: AnalyticsComponent },
    ],
  },
  {
    path: 'user-dash',
    component: UserDashComponent,
    canActivate: [roleGuard],
    data: { expectedRole: 'ROLE_PERSONNE' }, // Set expected role
    children: [
      { path: 'dashboard', component: UserAnalytics },
      { path: 'reservations', component: UserReservationComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: LoginComponent },
];

export const appConfig = {
  providers: [
    provideRouter(routes),
  ]
};