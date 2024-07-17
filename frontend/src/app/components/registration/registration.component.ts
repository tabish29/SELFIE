import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  username: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';

  constructor(private userService: UserService) {} 

  register() {
    const userData = new User(this.username, this.password, this.firstName, this.lastName);

    this.userService.addUser(userData).subscribe(response => {
      console.log('Registrazione avvenuta con successo', response);
    }, error => {
      console.error('Errore nella registrazione', error);
    });
  }
}
