import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashComponent } from './components/admin-dash/admin-dash.component';
import { AdminHUDComponent } from './components/admin-hud/admin-hud.component';

const routes: Routes = [
    { path: '', redirectTo: 'admin', pathMatch: 'full' }, // Redirect empty path to admin
    { path: 'admin', component: AdminHUDComponent },     // Main admin route
    { path: '**', redirectTo: 'admin' }                   // Catch all other routes and redirect to admin

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }