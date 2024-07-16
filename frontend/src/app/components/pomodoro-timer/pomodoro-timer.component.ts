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
  sessionMessage: string = 'Work Session';

  workMinutes: number = 30;
  shortBreakMinutes: number = 5;
  longBreakMinutes: number = 15;

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
      if (this.sessionMessage === 'Work Session') {
        this.minutes = this.workMinutes;
      } else if (this.sessionMessage === 'Short Break') {
        this.minutes = this.shortBreakMinutes;
      } else if (this.sessionMessage === 'Long Break') {
        this.minutes = this.longBreakMinutes;
      }
      this.seconds = 0;
    }
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
    this.updateTimer();
  }

  switchSession() {
    this.isRunning = false;
    clearInterval(this.interval);

    if (this.sessionMessage === 'Work Session') {
      this.sessionCount++;
      if (this.sessionCount % 4 === 0) {
        this.minutes = this.longBreakMinutes;
        this.sessionMessage = 'Long Break';
      } else {
        this.minutes = this.shortBreakMinutes;
        this.sessionMessage = 'Short Break';
      }
      this.isWorkMode = false;
      this.isBreakMode = true;
    } else {
      this.minutes = this.workMinutes;
      this.sessionMessage = 'Work Session';
      this.isWorkMode = true;
      this.isBreakMode = false;
    }

    this.seconds = 0;
    this.startTimer();
  }

}
