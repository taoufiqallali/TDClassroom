import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashComponent } from './components/admin-dash/admin-dash.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { UserDashComponent } from './components/user-dash/user-dash.component';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { 
      path: 'admin-dash', component: AdminDashComponent, 
      children: [
        { path: 'users', component: ManageUserComponent }
      ]
    },
    { path: '**', redirectTo: 'login' },
    { 
      path: 'user-dash', component: UserDashComponent, 
      children: [
        { path: 'users', component: ManageUserComponent }
      ]
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
