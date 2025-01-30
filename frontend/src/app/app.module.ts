import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/login/login.component';
import { AdminDashComponent } from './components/admin-dash/admin-dash.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, AdminDashComponent,],  // Add other components
  imports: [AppRoutingModule, BrowserModule],  // Make sure AppRoutingModule is in imports
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
