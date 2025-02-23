import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AdminDashComponent } from './components/admin-dash/admin-dash.component';
import { HeaderComponent } from './components/header/header.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { UserDashComponent } from './components/user-dash/user-dash.component';
import { UserSidebarComponent } from './components/user-sidebar/user-sidebar.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminDashComponent,
    HeaderComponent,
    AdminSidebarComponent,
    ManageUserComponent,
    RoomListComponent,
    AnalyticsComponent,
    UserDashComponent,
    UserSidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
