import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api/events'; // URL del tuo back-end

  constructor(private http: HttpClient) {}

  // Recupera gli eventi della settimana
  getEventiSettimana(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/settimana`);
  }
}
