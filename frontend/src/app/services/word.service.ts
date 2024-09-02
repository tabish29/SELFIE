import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private apiUrl = 'assets/data/words.json'; // Percorso al file JSON

  constructor(private http: HttpClient) {}

  getWords(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }
}
