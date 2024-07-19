import { Component } from '@angular/core';
import { TimeMachine } from '../../models/TimeMachine';
import { TimeMachineService } from '../../services/time-machine.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-time-machine',
  templateUrl: './time-machine.component.html',
  styleUrl: './time-machine.component.css'
})
export class TimeMachineComponent {
  timeMachine: TimeMachine | null = null;
  username: string | null = null;
  newDate: string = '';

  constructor(private timeMachineService: TimeMachineService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.username = this.localStorageService.getItem('username');
    if (this.username) {
      this.loadTimeMachine(this.username);
    }
  }

  loadTimeMachine(ownerUsername: string): void {
    this.timeMachineService.getTimeMachine(ownerUsername).subscribe(
      (timeMachine) => {
        this.timeMachine = timeMachine;
        this.newDate = timeMachine.date;
      },
      (error) => {
        console.error('Errore nel caricamento della TimeMachine', error);
      }
    );
  }

  updateTimeMachine(): void {
    if (this.username && this.timeMachine) {
      this.timeMachineService.updateTimeMachine(this.username, { date: this.newDate }).subscribe(
        (response) => {
          console.log('TimeMachine aggiornata con successo', response);
          this.timeMachine!.date = this.newDate;
        },
        (error) => {
          console.error('Errore nell\'aggiornamento della TimeMachine', error);
        }
      );
    }
  }

  resetTimeMachine(): void {
    const currentDate = new Date().toISOString();
    if (this.username) {
      this.timeMachineService.updateTimeMachine(this.username, { date: currentDate }).subscribe(
        (response) => {
          console.log('TimeMachine resettata con successo', response);
          if (this.timeMachine) {
            this.timeMachine.date = currentDate;
            this.newDate = currentDate;
          }
        },
        (error) => {
          console.error('Errore nel reset della TimeMachine', error);
        }
      );
    }
  }
}
