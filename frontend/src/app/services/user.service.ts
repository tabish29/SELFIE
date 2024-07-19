import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUserApiUrl = 'http://localhost:3000/users'; 

  constructor(private http: HttpClient) {}

  addUser(user: User): Observable<any> {
    return this.http.post(this.baseUserApiUrl, user);
  }

  updateUser(username: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.baseUserApiUrl}/${username}`, updatedData);
  }

  deleteUser(username: string): Observable<any> {
    return this.http.delete(`${this.baseUserApiUrl}/${username}`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUserApiUrl);
  }

  getUser(username: string): Observable<any> {
    return this.http.get<any>(`${this.baseUserApiUrl}/${username}`);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUserApiUrl}/login`, { username, password });
  }
}
