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
}
