import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservationList {
    id: number;
    personneId: number;  // Optional, based on your database schema
    localId: number;        // Optional, based on your database schema
    date: string; // Store dates as ISO strings (YYYY-MM-DD)
    startTime: string; // Store times as strings (HH:MM:SS)
    endTime:string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FIXED'; // Restrict to enum values
  }
  

@Injectable({
  providedIn: 'root'
})

export class reservationService{
  private apiUrl = 'http://localhost:8080/api/reservations'; // Your API endpoint

  constructor(private http: HttpClient) {}

  getReservations(): Observable<ReservationList[]> {
    return this.http.get<ReservationList[]>(this.apiUrl);
  }

  changeStatus(id: number, status: string): Observable<void> {
    const url = `${this.apiUrl}/${id}/status`;
    const body = { status: status }; // Create the request body

    return this.http.put<void>(url, body);
  }

}
