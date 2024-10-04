import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private apiUrl = 'http://localhost:3000/musics';  

  constructor(private http: HttpClient) { }

  
  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    return this.http.post<any>(`${this.apiUrl}`, formData, { headers });
  }

  deleteFile(filename: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${filename}`);
  }

  getMusicList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}`);
  }
}
