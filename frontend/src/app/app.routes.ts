// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashComponent } from './components/admin-dash/admin-dash.component';
import { AdminHUDComponent } from './components/admin-hud/admin-hud.component';

export const routes: Routes = [
  { path: 'hud', component: AdminHUDComponent },
  { path: 'admin-dash', component: AdminDashComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/login' } // Fallback route
];