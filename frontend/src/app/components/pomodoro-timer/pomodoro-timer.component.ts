import { Component } from '@angular/core';

@Component({
  selector: 'app-pomodoro-timer',
  templateUrl: './pomodoro-timer.component.html',
  styleUrl: './pomodoro-timer.component.css'
})
export class PomodoroTimerComponent {
  minutes: number = 30;
  seconds: number = 0;
  isRunning: boolean = false;
  interval: any;
  sessionCount: number = 0;
  sessionMessage: string = 'Sessione di Lavoro';
  workMinutes: number = 30;
  shortBreakMinutes: number = 5;
  selectedCycles: number = 2;
  totalHours: number = 0;
  totalMinutes: number = 0;
  cycleProposals: string[] = [];

  isWorkMode: boolean = true;
  isBreakMode: boolean = false;

  ngOnInit() {
    this.updateTimer();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  updateTimer() {
    if (!this.isRunning) {
      if (this.sessionMessage === 'Sessione di Lavoro') {
        this.minutes = this.workMinutes;
      } else {
        this.minutes = this.shortBreakMinutes;
      }
      this.seconds = 0;
    }
  }

  calculateCycles() {
    const totalMinutesAvailable = (this.totalHours * 60) + this.totalMinutes;
    const combinations = [
        { work: 30, break: 5 },
        { work: 25, break: 5 },
        { work: 40, break: 7 },
        { work: 50, break: 10 },
    ];

    this.cycleProposals = [];
    combinations.forEach(combination => {
        const cycleDuration = combination.work + combination.break;
        const numberOfCycles = Math.floor(totalMinutesAvailable / cycleDuration);
        if (numberOfCycles > 0) {
            this.cycleProposals.push(`Cicli: ${numberOfCycles} - ${combination.work} min di lavoro e ${combination.break} min di pausa`);
        }
    });
  }

  startTimer() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.interval = setInterval(() => {
        if (this.seconds === 0) {
          if (this.minutes === 0) {
            this.switchSession();
          } else {
            this.minutes--;
            this.seconds = 59;
          }
        } else {
          this.seconds--;
        }
      }, 1000);
    }
  }

  pauseTimer() {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.interval);
    }
  }

  resetTimer() {
    this.isRunning = false;
    clearInterval(this.interval);
    this.sessionMessage = 'Sessione di Lavoro';
    this.isWorkMode = true;
    this.isBreakMode = false;
    this.sessionCount = 0; 
    this.updateTimer();
  }

  switchSession() {
    this.isRunning = false;
    clearInterval(this.interval);

    if (this.sessionMessage === 'Sessione di Lavoro') {
      this.minutes = this.shortBreakMinutes;
      this.sessionMessage = 'Pausa';
      this.isWorkMode = false;
      this.isBreakMode = true;
    } else {
      this.sessionCount++;
      this.minutes = this.workMinutes;
      this.sessionMessage = 'Sessione di Lavoro';
      this.isWorkMode = true;
      this.isBreakMode = false;
    }

    this.seconds = 0;

    // Controllo se il numero di sessioni raggiunge i cicli selezionati
    if (this.sessionCount >= this.selectedCycles) {
      this.notifyUser('Complimenti! Hai finito la sessione del Pomodoro Timer che avevi impostato.');
      this.resetTimer();
    } else {
      this.startTimer();
    }
  }

  forceNextSession() {
    this.switchSession();
  }

  endCycle() {
    this.isRunning = false;
    clearInterval(this.interval);
    this.sessionMessage = 'Sessione di Lavoro';
    this.isWorkMode = true;
    this.isBreakMode = false;
    this.sessionCount += 1; 
    this.updateTimer();
  }

  notifyUser(message: string = this.sessionMessage) {
    alert(message);
  }
}