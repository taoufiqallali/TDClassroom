import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  personneId?: number;     // Optional for create, required for update
  nom: string;            // Corresponds to `nom`
  prenom: string;         // Corresponds to `prenom`
  dateNaissance: string;  // Corresponds to `dateNaissance`
  email: string;          // Corresponds to `email`
  cin: string;            // Corresponds to `CIN`
  tel: string;            // Corresponds to `tel`
  grade: string;          // Corresponds to `grade`
  address: string;        // Corresponds to `address`
  ville: string;          // Corresponds to `ville`
  codePostale: string;    // Corresponds to `codePostale`
  responsabilite: string; // Corresponds to `responsabilite`
  nomBanque: string;      // Corresponds to `nomBanque`
  som: string;            // Corresponds to `som`
  motDePasse: string;     // Corresponds to `motDePasse`
  uniteOrganisation: {    // Corresponds to `uniteOrganisation`
    idUnite: number;
  };
  roles: { roleId: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class UserCreateService {
  private apiUrl = 'http://localhost:8080/api/personnes'; // Your API endpoint

  constructor(private http: HttpClient) {}

  // Method to create a new user
  createUser(user: User): Observable<string> {
    // Map roles to role IDs
    // const roles = user.roles.map(role => {
    //   if (role === 'ADMIN') {
    //     return { roleId: 1 };
    //   } else if (role === 'PERSONNE') {
    //     return { roleId: 2 };
    //   } else {
    //     throw new Error(`Invalid role: ${role}`);
    //   }
    // });

    // Construct the payload
    const payload = {
      nom: user.nom,
      prenom: user.prenom,
      dateNaissance: user.dateNaissance,
      email: user.email,
      cin: user.cin,
      tel: user.tel,
      grade: user.grade,
      address: user.address,
      ville: user.ville,
      codePostale: user.codePostale,
      responsabilite: user.responsabilite,
      nomBanque: user.nomBanque,
      som: user.som,
      motDePasse: user.motDePasse,
      uniteOrganisation: {
        "idUnite": 1
      },
      roles:[
        {
          "roleId": 2
        }
      ]
    };
    console.log("Payload before sending:", JSON.stringify(payload, null, 2));
    // Send POST request to the backend
    return this.http.post(this.apiUrl, payload,{ responseType: 'text' });
  }

  // Method to update an existing user
  updateUser(userId: number, user: User): Observable<string> {

    const payload = {
      nom: user.nom,
      prenom: user.prenom,
      dateNaissance: user.dateNaissance,
      email: user.email,
      cin: user.cin,
      tel: user.tel,
      grade: user.grade,
      address: user.address,
      ville: user.ville,
      codePostale: user.codePostale,
      responsabilite: user.responsabilite,
      nomBanque: user.nomBanque,
      som: user.som,
      motDePasse: user.motDePasse,
      uniteOrganisation: {
        "idUnite": 1
      },
      roles:[
        {
          "roleId": 2
        }
      ]
    };

    // Send PUT request to the backend
    return this.http.put(`${this.apiUrl}/${user.personneId}`, payload,{responseType: 'text'});
  }

  deleteUser(userId:number): Observable<string> {
   
    return this.http.delete(this.apiUrl+'/'+userId.toString(),{ responseType: 'text' });
  }
}