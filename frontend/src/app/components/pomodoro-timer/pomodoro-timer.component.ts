import { Component } from '@angular/core';
import { DragService } from '../../services/drag.service';
import { Subscription } from 'rxjs';
import { PomodoroTimerService } from '../../services/pomodoro-timer.service';

@Component({
  selector: 'app-pomodoro-timer',
  templateUrl: './pomodoro-timer.component.html',
  styleUrl: './pomodoro-timer.component.css'
})
export class PomodoroTimerComponent {
  private stateSubscription: Subscription | null = null;
  minutes: number = 30;
  seconds: number = 0;
  isRunning: boolean = false;
  sessionCount: number = 0;
  sessionMessage: string = 'Sessione di Lavoro';
  workMinutes: number = 30;
  shortBreakMinutes: number = 5;
  selectedCycles: number = 5;
  totalHours: number = 0;
  totalMinutes: number = 0;
  cycleProposals: string[] = [];
  isWorkMode: boolean = true;
  isBreakMode: boolean = false;

  constructor(private pomodoroTimerService: PomodoroTimerService, private dragService: DragService) { }

  ngOnInit() {
    this.stateSubscription = this.pomodoroTimerService.state$.subscribe(state => {
      this.minutes = state.minutes;
      this.seconds = state.seconds;
      this.isRunning = state.isRunning;
      this.sessionCount = state.sessionCount;
      this.sessionMessage = state.sessionMessage;
      this.workMinutes = state.workMinutes;
      this.shortBreakMinutes = state.shortBreakMinutes;
      this.selectedCycles = state.selectedCycles;
      this.totalHours = state.totalHours;
      this.totalMinutes = state.totalMinutes;
      this.cycleProposals = state.cycleProposals;
      this.isWorkMode = state.isWorkMode;
      this.isBreakMode = state.isBreakMode;
    });
  }

  ngOnDestroy() {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  startTimer() {
    this.pomodoroTimerService.setState({
      minutes: this.minutes ?? 32,
      workMinutes: this.workMinutes ?? 30,
      shortBreakMinutes: this.shortBreakMinutes ?? 5,
      selectedCycles: this.selectedCycles ?? 5,
      totalHours: this.totalHours ?? 0,
      totalMinutes: this.totalMinutes ?? 0
    });
    this.pomodoroTimerService.startTimer();
  }

  pauseTimer() {
    this.pomodoroTimerService.pauseTimer();
  }

  resetTimer() {
    this.pomodoroTimerService.resetTimer();
  }

  forceNextSession() {
    this.pomodoroTimerService.forceNextSession();
  }

  endCycle() {
    this.pomodoroTimerService.endCycle();
  }

  restartCycle() {
    this.pomodoroTimerService.restartCycle();
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

  onMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    this.dragService.startDrag(event, target);
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

}