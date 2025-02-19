import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashComponent } from './components/admin-dash/admin-dash.component';


const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect empty path to login
    { path: 'admin-dash', component: AdminDashComponent }, // Correct component name
    { path: 'login', component: LoginComponent }, // Add login route
    { path: '**', redirectTo: 'login' } // Redirect unknown routes to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
