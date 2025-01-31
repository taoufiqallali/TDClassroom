import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Room_list {
    idLocal:number,
    nom: string,
    capacite: number,
    accessibilitePmr: string,
    uniteOrganisationNom:string,
}

@Injectable({
  providedIn: 'root'
})
export class roomlistservice{
  private apiUrl = 'http://localhost:8080/api/locals'; // Your API endpoint

  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room_list[]> {
    return this.http.get<Room_list[]>(this.apiUrl);
  }
  updateRoom(idLocal:number,Roomdata:Room_list):Observable<string>{
    const payload={
        nom: Roomdata.nom,
        capacite: Roomdata.capacite,
        accessibilitePmr: Roomdata.accessibilitePmr,
        uniteOrganisation: {"idUnite": 1}
            }
    return this.http.put(this.apiUrl+"/"+idLocal,payload,{responseType: 'text'});
  }
createRoom(Roomdata:Room_list){

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
      nom: Roomdata.nom,
        capacite: Roomdata.capacite,
        accessibilitePmr: Roomdata.accessibilitePmr,
        uniteOrganisation: {"idUnite": 1}
    };
    console.log("Payload before sending:", JSON.stringify(payload, null, 2));
    // Send POST request to the backend
    return this.http.post(this.apiUrl, payload,{ responseType: 'text' });




}
  deleteRoom(room:Room_list){
    return this.http.delete(this.apiUrl+"/"+room.idLocal,{responseType: 'text'});
  }
}
