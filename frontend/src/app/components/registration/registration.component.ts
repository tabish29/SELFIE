import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { TimeMachine } from '../../models/TimeMachine';
import { TimeMachineService } from '../../services/time-machine.service';

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
  errorMessage: string = ''; 

  constructor(private userService: UserService,private timeMachineService: TimeMachineService,private router: Router) {} 

  register() {
    const userData = new User(this.username, this.password, this.firstName, this.lastName);

    this.userService.addUser(userData).subscribe(response => {
      console.log('Registrazione avvenuta con successo', response);
      this.createTimeMachineForUser(this.username);
      this.router.navigateByUrl('/login');
    }, error => {
      console.error('Errore nella registrazione', error);
      
      if (error.error && error.error.error) {
        this.errorMessage = error.error.error; 
      } else {
        this.errorMessage = "'Errore nella registrazione. Riprova.'";
      }

    });
  }

  private createTimeMachineForUser(machineOwner: string) {
    const timeMachineData = new TimeMachine(machineOwner,new Date().toISOString());

    this.timeMachineService.addTimeMachine(timeMachineData).subscribe(response => {
      console.log('TimeMachine creata con successo', response);
    }, error => {
      console.error('Errore nella creazione della TimeMachine', error);
    });
  }
}
