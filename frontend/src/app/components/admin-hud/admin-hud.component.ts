import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-admin-hud',
  imports: [HeaderComponent,SidePanelComponent,FooterComponent],
  templateUrl: './admin-hud.component.html',
  styleUrl: './admin-hud.component.css'
})
export class AdminHUDComponent {

}
