import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User_list {
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  grade: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/personnes'; // Your API endpoint

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User_list[]> {
    return this.http.get<User_list[]>(this.apiUrl);
  }
}
