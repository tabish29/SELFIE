import { Component } from '@angular/core';
import { RegisterService } from './services/register.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  username: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';

  constructor(private registerService: RegisterService) {}

  register() {
    const userData = {
      username: this.username,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName
    };

    this.registerService.register(userData).subscribe(response => {
      console.log('Registrazione avvenuta con successo', response);
    }, error => {
      console.error('Errore nella registrazione', error);
    });
  }

}
