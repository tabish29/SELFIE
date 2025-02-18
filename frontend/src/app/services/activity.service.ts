import { Injectable } from '@angular/core';
import { Activity } from '../models/Activity';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'  //service disponibile a livello globale
})
export class ActivityService {

  private apiUrl = 'http://localhost:3000/activities';  

  constructor(private http: HttpClient) { }

  getActivities(): Observable<Activity[]> {    
    return this.http.get<Activity[]>(this.apiUrl);
  }

  getActivityByTitle(title: string): Observable<Activity> {   
    return this.http.get<Activity>(`${this.apiUrl}/${title}`);
  }

  createActivity(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(this.apiUrl, activity);
  }

  deleteActivity(authorUsername: string, title: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${authorUsername}/${title}`);
  }

  getActivitiesByAuthor(authorUsername: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/authors/${authorUsername}`);
  }

  updateActivity(authorUsername: string, title: string, activity: Activity): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}/${authorUsername}/${title}`, activity);
  }

}
