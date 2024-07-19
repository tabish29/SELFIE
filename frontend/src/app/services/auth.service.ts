import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedIn = false;

  constructor(private localStorageService: LocalStorageService) {  }

  hasLoggedIn(): boolean {
    const username = this.localStorageService.getItem('username');
    this.isLoggedIn =!!username;
    return this.isLoggedIn
  }

  logout(): void {
    this.localStorageService.removeItem('username');
    this.isLoggedIn = false;
  }
}
