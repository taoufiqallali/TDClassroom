import { Component, Input, OnInit,EventEmitter, Output  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserCreateService } from '../../services/user_create.service';


interface User{
  personneId: number;     // Corresponds to `personneId` in the backend
  nom: string;            // Corresponds to `nom`
  prenom: string;         // Corresponds to `prenom`
  dateNaissance: string;  // Corresponds to `dateNaissance` (converted to string in frontend)
  email: string;          // Corresponds to `email`
  cin: string;            // Corresponds to `CIN`
  tel: string;            // Corresponds to `tel`
  grade: string;          // Corresponds to `grade` (which is an enum in backend but a string in frontend)
  address: string;        // Corresponds to `address`
  ville: string;          // Corresponds to `ville`
  codePostale: string;    // Corresponds to `codePostale`
  responsabilite: string; // Corresponds to `responsabilite` (which is an enum in backend but a string in frontend)
  nomBanque: string;      // Corresponds to `nomBanque`
  som: string;            // Corresponds to `som`
  motDePasse: string;     // Corresponds to `motDePasse`
  uniteOrganisation: any; // Corresponds to `uniteOrganisation`, could be an object or a simple type depending on your use case
  roles: any[];           // Corresponds to the roles in the `Personne_role` join table, an array of roles
}
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  @Input() userId?: String;
  @Output() triggercloseItem = new EventEmitter<void>();
  @Output() triggersimple_notification = new EventEmitter<string>();

  self_close() {
    this.triggercloseItem.emit(); // Emit event when called
  }

  simple_notification(message:string){

    this.triggersimple_notification.emit(message);

  }

  user: User = {
    personneId: 0,
    nom: '',
    prenom: '',
    dateNaissance: '',
    email: '',
    cin: '',
    tel: '',
    grade: '',
    address: '',
    ville: '',
    codePostale: '',
    responsabilite: '',
    nomBanque: '',
    som: '',
    motDePasse: '',
    uniteOrganisation: '',
    roles: []
  };

  isEditMode = false;
  submitted = false;
  errorMessage = '';

  constructor(private http: HttpClient,private userCreateService: UserCreateService) {}

  ngOnInit() {

    if (this.userId) {
      this.isEditMode = true;
      this.loadUser();
    }
  }

  loadUser() {
   
    this.http.get<User>(`http://localhost:8080/api/personnes/email/${this.userId}`)
      .subscribe({
        next: (data) => {
          this.user = {
            ...data,
            dateNaissance: this.formatDateForInput(data.dateNaissance), // Format the dat
            motDePasse:''
          };
        },
        error: (error) => {
          console.error('Error loading user:', error);
          this.errorMessage = 'Failed to load user data';
        }
      });


  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return ''; // Handle empty dates
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
  }


  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      this.updateUser();
    } else {
      this.createUser();
    }



  }

  private createUser() {
    this.userCreateService.createUser(this.user).subscribe({
      next: (message) => {
        console.log('User created successfully:', message);
        // Handle success (e.g., show a success message or redirect)
        this.simple_notification(`user created successfully! ✅`);
        this.self_close();
      },
      error: (err) => {
        console.error('Failed to create user:', err);
        // Handle error (e.g., show an error message)
        this.simple_notification(`❌ Error creating user. Please try again.`);
        
      }
    });
  }

  private updateUser() {
    this.userCreateService.updateUser(this.user.personneId,this.user).subscribe({
      next: (message) => {
        console.log('User updated successfully:', message);
        // Handle success (e.g., show a success message or redirect)
        this.simple_notification(`user updated successfully! ✅`);
        this.self_close();
      },
      error: (err) => {
        console.error('Failed to update user:', err);
        // Handle error (e.g., show an error message)
        this.simple_notification(`❌ updating user. Please try again.`);
      }
    });
    
  }

  resetForm() {
    this.user = {
      personneId: 0,
      nom: '',
      prenom: '',
      dateNaissance: '',
      email: '',
      cin: '',
      tel: '',
      grade: '',
      address: '',
      ville: '',
      codePostale: '',
      responsabilite: '',
      nomBanque: '',
      som: '',
      motDePasse: '',
      uniteOrganisation: '',
      roles: []
    };
    this.submitted = false;
  }

  // Available grades for dropdown
  grades = [    'professeur',
    'ingenieur',
    'technicien'];
  responsabilites=[    'administrateur',
      'chef',
      'adjoint',
      'directeur'];
  availableRoles = ['ADMIN', 'PERSONNE'];
  uniteOrganisations=[  'fso',
    'informatique',
    'mathematique',
    'physique',
    'chimie',
    'biologie',
    'geologie'];


    

}

