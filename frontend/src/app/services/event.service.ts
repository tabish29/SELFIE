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

  getEvent(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  deleteEvent(title: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${title}`);
  }

  getEventsByAuthor(authorUsername: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/authors/${authorUsername}`);
  }

  updateEvent(authorUsername: string, title: string, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${authorUsername}/${title}`, event);
  }
}


