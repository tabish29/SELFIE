import { Component } from '@angular/core';
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

  constructor(private userService: UserService,private timeMachineService: TimeMachineService) {} 

  register() {
    const userData = new User(this.username, this.password, this.firstName, this.lastName);

    this.userService.addUser(userData).subscribe(response => {
      console.log('Registrazione avvenuta con successo', response);
      this.createTimeMachineForUser(this.username);
    }, error => {
      console.error('Errore nella registrazione', error);
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
