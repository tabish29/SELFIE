import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TimeMachine } from '../models/TimeMachine';
import { interval, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeMachineService {

  private baseTimeMachineApiUrl = 'http://localhost:3000/timeMachines';

  private updateSubscription: Subscription | null = null;

  constructor(private http: HttpClient) { }

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

  startAutoUpdate(ownerUsername: string, updateInterval: number): void {
    this.updateSubscription = interval(updateInterval).subscribe(() => {
      this.updateTimeMachineWithCurrentDate(ownerUsername, updateInterval);
    });
  }

  stopAutoUpdate(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  private parseDate(dateString: string): Date {
    const [day, month, year, hours, minutes] = dateString.split(/[/ :]/);
    return new Date(+year, +month - 1, +day, +hours, +minutes);
  }

  private updateTimeMachineWithCurrentDate(machineOwner: string, updateInterval: number): void {

    this.getTimeMachine(machineOwner).subscribe(
      (timeMachine) => {
        const timeMachineDate = this.parseDate(timeMachine.date);

        const updatedTime = new Date(timeMachineDate.getTime() + updateInterval);
        const formattedDate = this.formatDate(updatedTime);

        // Stampa i valori di updatedTime e formattedDate
        console.log("Questo è il tempo:", timeMachineDate);
        console.log("Questo è il tempo aggiornato:", updatedTime);
        console.log("Questo è il tempo formattato:", formattedDate);


        this.updateTimeMachine(machineOwner, { date: formattedDate }).subscribe(
          response => {
            console.log('TimeMachine aggiornata automaticamente con successo', response);
          },
          error => {
            console.error('Errore nell\'aggiornamento automatico della TimeMachine', error);
          }
        );
      },
      error => {
        console.error('Errore nel recupero della TimeMachine', error);
      }
    );
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

}
