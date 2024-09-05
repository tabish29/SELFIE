import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class accessGuard {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate: CanActivateFn = (route, state) => {
    if (this.authService.hasLoggedIn()) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }

}