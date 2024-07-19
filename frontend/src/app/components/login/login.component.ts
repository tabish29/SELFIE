import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private userService: UserService,private router: Router) {}
  
  onLogin() {
    this.userService.login(this.username, this.password).subscribe(
      response => {
        console.log('Login successful', response);

        this.router.navigateByUrl('/home');
       
      },
      error => {
        console.error('Login failed', error);
       
      }
    );
  }


}