import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TimeMachine } from '../models/TimeMachine';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeMachineService {

  private baseTimeMachineApiUrl = 'http://localhost:3000/timeMachines'; 

  constructor(private http: HttpClient) {}

  addTimeMachine(timeMachine: TimeMachine): Observable<any> {
    return this.http.post(this.baseTimeMachineApiUrl, timeMachine);
  }

  updateTimeMachine(ownerUsername: string, updatedData: Partial<TimeMachine>): Observable<any> {
    return this.http.put(`${this.baseTimeMachineApiUrl}/${ownerUsername}`, updatedData);
  }

  deleteTimeMachine(ownerUsername: string): Observable<any> {
    return this.http.delete(`${this.baseTimeMachineApiUrl}/${ownerUsername}`);
  }

  getTimeMachines(): Observable<TimeMachine[]> {
    return this.http.get<TimeMachine[]>(this.baseTimeMachineApiUrl);
  }

  getTimeMachine(ownerUsername: string): Observable<TimeMachine> {
    return this.http.get<TimeMachine>(`${this.baseTimeMachineApiUrl}/${ownerUsername}`);
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

}
