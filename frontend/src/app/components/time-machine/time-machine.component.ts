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

      this.timeMachineService.timeMachineObservable.subscribe(
        (timeMachine) => {
          if (timeMachine) {
            this.timeMachine = timeMachine;
          }
        }
      );
    }
  }

  loadTimeMachine(ownerUsername: string): void {
    this.timeMachineService.getTimeMachine(ownerUsername).subscribe(
      (timeMachine) => {
        this.timeMachine = timeMachine;
      },
      (error) => {
        console.error('Errore nel caricamento della TimeMachine', error);
      }
    );
  }

  updateTimeMachine(): void {
    if (this.username && this.timeMachine) {
      const formattedDate = this.timeMachineService.formatDate(new Date(this.newDate));
      this.timeMachineService.updateTimeMachine(this.username, { date: formattedDate }).subscribe(
        (response) => {
          console.log('TimeMachine aggiornata con successo', response);
          this.timeMachine!.date = formattedDate;
        },
        (error) => {
          console.error('Errore nell\'aggiornamento della TimeMachine', error);
        }
      );
    }
  }

  resetTimeMachine(): void {
    const currentDate = new Date();
    const formattedDate = this.timeMachineService.formatDate(currentDate);
    if (this.username) {
      this.timeMachineService.updateTimeMachine(this.username, { date: formattedDate }).subscribe(
        (response) => {
          console.log('TimeMachine resettata con successo', response);

          if (this.timeMachine) {
            this.timeMachine.date = formattedDate;
          }
        },
        (error) => {
          console.error('Errore nel reset della TimeMachine', error);
        }
      );
    }
  }
}