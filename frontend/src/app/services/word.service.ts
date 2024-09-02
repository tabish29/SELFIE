import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private baseWordsApiUrl = 'http://localhost:3000/words'; 

  constructor(private http: HttpClient) {}

  getRandomWord(): Observable<string> {
    return this.http.get<string>(`${this.baseWordsApiUrl}/random`);
  }
}
