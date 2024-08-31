import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TimeMachineService } from '../../services/time-machine.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router,private timeMachineService: TimeMachineService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.hasLoggedIn();
  }

  onLogout(): void {
    this.timeMachineService.stopAutoUpdate();
    this.authService.logout();
    this.isLoggedIn = false;

    this.router.navigateByUrl('/login');
  }

}
