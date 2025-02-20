import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservationList {
    id_reservation: number;
    id_utilisateur: number;  // Optional, based on your database schema
    id_local: number;        // Optional, based on your database schema
    date_reservation: string; // Store dates as ISO strings (YYYY-MM-DD)
    start_time: string; // Store times as strings (HH:MM:SS)
    end_time:string;
    duree: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FIXED'; // Restrict to enum values
  }
  

@Injectable({
  providedIn: 'root'
})

export class reservationService{
  private apiUrl = 'http://localhost:8080/api/reservations'; // Your API endpoint

  constructor(private http: HttpClient) {}

}
