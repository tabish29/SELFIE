import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PomodoroTimer } from '../models/pomodoro-timer.interface';

@Injectable({
  providedIn: 'root'
})
export class PomodoroTimerService {
  private state: PomodoroTimer = {
    minutes: 30,
    seconds: 0,
    isRunning: false,
    interval: null,
    sessionCount: 0,
    sessionMessage: 'Sessione di Lavoro',
    workMinutes: 30,
    shortBreakMinutes: 5,
    selectedCycles: 5,
    totalHours: 0,
    totalMinutes: 0,
    cycleProposals: [],
    isWorkMode: true,
    isBreakMode: false,
  };

  private stateSubject: BehaviorSubject<PomodoroTimer> = new BehaviorSubject<PomodoroTimer>(this.state);
  state$: Observable<PomodoroTimer> = this.stateSubject.asObservable();

  private notifyChange() {
    this.stateSubject.next(this.state);
  }

  getState(): PomodoroTimer {
    return this.stateSubject.getValue();
  }

  setState(newState: Partial<PomodoroTimer>): void {
    this.state = { ...this.state, ...newState };
    this.stateSubject.next(this.state);
  }

  startTimer() {
    if (!this.state.isRunning) {

      this.state.isRunning = true;
      this.state.interval = setInterval(() => {
        if (this.state.seconds === 0) {
          if (this.state.minutes === 0) {
            this.switchSession();
          } else {
            this.state.minutes--;
            this.state.seconds = 59;
          }
        } else {
          this.state.seconds--;
        }
        this.notifyChange();
      }, 1000);
    }
  }

  pauseTimer() {
    if (this.state.isRunning) {
      this.state.isRunning = false;
      clearInterval(this.state.interval);
      this.state.interval = null;
      this.notifyChange();
    }
  }

  resetTimer() {
    this.state.isRunning = false;
    clearInterval(this.state.interval);
    this.state.interval = null;
    this.state.sessionMessage = 'Sessione di Lavoro';
    this.state.isWorkMode = true;
    this.state.isBreakMode = false;
    this.state.sessionCount = 0;
    this.updateTimer();
    this.notifyChange();
  }

  updateTimer() {
    if (!this.state.isRunning) {
      this.state.minutes = this.state.sessionMessage === 'Sessione di Lavoro' ? this.state.workMinutes : this.state.shortBreakMinutes;
      this.state.seconds = 0;
      this.notifyChange();
    }
  }

  switchSession() {
    this.state.isRunning = false;
    clearInterval(this.state.interval);
    this.state.interval = null;

    if (this.state.sessionMessage === 'Sessione di Lavoro') {
      this.state.minutes = this.state.shortBreakMinutes;
      this.state.seconds = 0;
      this.state.sessionMessage = 'Sessione di Pausa';
      this.state.isWorkMode = false;
      this.state.isBreakMode = true;
      this.notifyUser("Inizio pausa!");
      this.startTimer();
    } else {
      this.state.sessionCount++;
      this.state.minutes = this.state.workMinutes;
      this.state.seconds = 0;
      this.state.sessionMessage = 'Sessione di Lavoro';
      this.state.isWorkMode = true;
      this.state.isBreakMode = false;
      if (this.state.sessionCount >= this.state.selectedCycles) {
        this.notifyUser('Complimenti! Hai finito la sessione del Pomodoro Timer che avevi impostato.');
        this.resetTimer();
      } else {
        this.notifyUser("Inizio ciclo");
        this.startTimer();
      }

    }

    this.notifyChange();
  }

  forceNextSession() {
    this.switchSession();
  }

  endCycle() {
    this.state.sessionMessage = "Fine Ciclo";
    this.notifyUser("Hai terminato il ciclo corrente.");
    this.switchSession();
    this.updateTimer();
    this.notifyChange();
  }

  restartCycle(){
    this.state.sessionCount--;
    this.state.sessionMessage = "Ricomincia il Ciclo";
    this.switchSession();
    this.updateTimer();
    this.notifyChange();
  }

  notifyUser(message: string) {
    alert(message);
  }

  calculateCycles() {
    const totalMinutesAvailable = (this.state.totalHours * 60) + this.state.totalMinutes;
    const combinations = [
      { work: 30, break: 5 },
      { work: 25, break: 5 },
      { work: 40, break: 7 },
      { work: 50, break: 10 },
    ];

    this.state.cycleProposals = [];
    combinations.forEach(combination => {
      const cycleDuration = combination.work + combination.break;
      const numberOfCycles = Math.floor(totalMinutesAvailable / cycleDuration);
      if (numberOfCycles > 0) {
        this.state.cycleProposals.push(`Cicli: ${numberOfCycles} - ${combination.work} min di lavoro e ${combination.break} min di pausa`);
      }
    });
    this.notifyChange();
  }
}
