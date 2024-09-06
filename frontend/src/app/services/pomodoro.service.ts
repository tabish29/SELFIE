import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PomodoroService {
  private apiUrl = 'http://localhost:3000/api/pomodoro'; // URL del tuo back-end

  constructor(private http: HttpClient) {}

  // Recupera l'ultimo report del Pomodoro
  getLastPomodoro(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/last`);
  }
}
