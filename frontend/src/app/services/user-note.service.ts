import { Injectable } from '@angular/core';
import { UserNote } from '../models/UserNote';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserNoteService {
  private apiUrl = 'http://localhost:3000/userNotes';

  constructor(private http: HttpClient) { }

  getNotes(): Observable<UserNote[]> {
    return this.http.get<UserNote[]>(this.apiUrl);
  }

  getNoteByTitle(title: string): Observable<UserNote> {
    return this.http.get<UserNote>(`${this.apiUrl}/${title}`);
  }

  createNote(note: UserNote): Observable<UserNote> {
    return this.http.post<UserNote>(this.apiUrl, note);
  }

  updateNote(authorUsername: string, title: string, note: Partial<UserNote>): Observable<UserNote> {
    return this.http.put<UserNote>(`${this.apiUrl}/${authorUsername}/${title}`, note);
  }

  deleteNote(authorUsername: string, title: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${authorUsername}/${title}`);
  }

  getNotesByAuthor(authorUsername: string): Observable<UserNote[]> {
    return this.http.get<UserNote[]>(`${this.apiUrl}/authors/${authorUsername}`);
  }
}
