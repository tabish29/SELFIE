import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/Event';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  //private apiUrl = 'http://localhost:3000/api/events'; // URL del tuo back-end
  private apiUrl = 'http://localhost:3000/events';

  constructor(private http: HttpClient) {}

  // Recupera gli eventi della settimana
  getEventiSettimana(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/settimana`);
  }

  createEvent(event: Event): Observable<Event> {
    console.log(event);
    return this.http.post<Event>(this.apiUrl, event);
    
  }
}
