import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/Event';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:3000/events';

  constructor(private http: HttpClient) {}

  /*// Recupera gli eventi della settimana
  getEventiSettimana(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/settimana`);
  }*/

  getEvent(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }


  createEvent(event: Event): Observable<Event> {
    console.log(event);
    return this.http.post<Event>(this.apiUrl, event);
    
  }

  deleteEvent(title: string): Observable<void> {
    console.log("deleteEvent");
    return this.http.delete<void>(`${this.apiUrl}/${title}`);
  }

  getEventsByAuthor(authorUsername: string): Observable<Event[]> {
    console.log("autore: " + authorUsername);
    return this.http.get<Event[]>(`${this.apiUrl}/authors/${authorUsername}`);
  }
}
