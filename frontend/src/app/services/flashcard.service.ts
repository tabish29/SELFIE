import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FlashcardSet } from '../models/FlashcardSet';

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {

  private apiUrl = 'http://localhost:3000/flashcards';

  constructor(private http: HttpClient) { }


  getFlashcards(): Observable<FlashcardSet[]> {
    return this.http.get<FlashcardSet[]>(this.apiUrl);
  }

  getFlashcardByTopic(topic: string): Observable<FlashcardSet> {
    return this.http.get<FlashcardSet>(`${this.apiUrl}/${topic}`);
  }


  getFlashcardsByAuthor(author: string): Observable<FlashcardSet[]> {
    return this.http.get<FlashcardSet[]>(`${this.apiUrl}/authors/${author}`);
  }

  createFlashcardSet(flashcardSet: FlashcardSet): Observable<FlashcardSet> {
    return this.http.post<FlashcardSet>(this.apiUrl, flashcardSet);
  }

  updateFlashcardSetTopic(author: string, oldTopicName: string, newTopicName: string): Observable<FlashcardSet> {
    return this.http.put<FlashcardSet>(`${this.apiUrl}/authors/${author}/topics/${oldTopicName}`, { newTopicName });
  }

  updateFlashcard(author: string, topic: string, oldQuestion: string, newQuestion: string, newAnswer: string): Observable<void> {
    const encodedOldQuestion = encodeURIComponent(oldQuestion);

    return this.http.put<void>(`${this.apiUrl}/authors/${author}/topics/${topic}/flashcards/${encodedOldQuestion}`, {
      newQuestion,
      newAnswer
    });
  }

  deleteFlashcardSet(author: string, topic: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/authors/${author}/topics/${topic}`);
  }

  getAllTopics(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/topics`);
  }

  addTopic(author: string, topic: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/authors/${author}/topics`, { topic });
  }

  deleteFlashcard(author: string, topic: string, question: string) {
    const encodedQuestion = encodeURIComponent(question);

    return this.http.delete<void>(`${this.apiUrl}/authors/${author}/topics/${topic}/flashcards/${encodedQuestion}`);
  }

}
