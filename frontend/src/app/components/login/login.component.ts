import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = ''; 

  constructor(private userService: UserService,private router: Router, private localStorageService: LocalStorageService) {}


  onLogin() {
    this.userService.login(this.username, this.password).subscribe(
      response => {
        console.log('Login successful', response);
      
        this.localStorageService.setItem('username', this.username);

        this.router.navigateByUrl('/home');
      },
      error => {
        console.error('Login failed', error);
       
        if (error.error && error.error.error) {
          this.errorMessage = error.error.error; 
        } else {
          this.errorMessage = "C'è stato un errore inaspettato";
        }
        
      }
    );
  }

}