import { Component , Input} from '@angular/core';

@Component({
  selector: 'app-dash-button',
  imports: [],
  templateUrl: './dash-button.component.html',
  styleUrl: './dash-button.component.css'
})
export class DashButtonComponent {
  @Input() iconSrc: string = 'icon'; // Path to the icon image
  @Input() description: string = 'button-description'; // Tooltip description
  @Input() altsrc: string = 'icon_alt'; // Tooltip description
}
