import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Room_list {

  idLocal: number; // or bigint if your environment supports it
  id_unite?: number; // or bigint if your environment supports it and make it optional
  nom: string;
  capacite: number;
  accessibilitePmr: string; // or number (0 or 1) depending on how tinyint(1) is represented
  datashow?: string; // or number (0 or 1) depending on how tinyint(1) is represented and make it optional
  ecranTactile?: string; // or number (0 or 1) depending on how tinyint(1) is represented and make it optional

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
        datashow:Roomdata.datashow,
        ecranTactile:Roomdata.ecranTactile,
        uniteOrganisation: {"idUnite": 1}
            }
    return this.http.put(this.apiUrl+"/"+idLocal,payload,{responseType: 'text'});
  }
createRoom(Roomdata:Room_list){
    const payload = {
      nom: Roomdata.nom,
        capacite: Roomdata.capacite,
        accessibilitePmr: Roomdata.accessibilitePmr,
        datashow:Roomdata.datashow,
        ecranTactile:Roomdata.ecranTactile,
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
