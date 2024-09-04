import { Injectable } from '@angular/core';
import { Activity } from '../models/Activity';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'http://localhost:3000/activities';  

  constructor(private http: HttpClient) { }

  getActivitiy(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl);
  }

  getActivityByTitle(title: string): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/${title}`);
  }

  createActivity(activity: Activity): Observable<Activity> {
    console.log("activity.service: " + activity.title);
    return this.http.post<Activity>(this.apiUrl, activity);
    
  }

  deleteActivity(title: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${title}`);
  }

  getActivitiesByAuthor(authorUsername: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/authors/${authorUsername}`);
  }
}
