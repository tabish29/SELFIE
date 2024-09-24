import { Component, Input, OnInit } from '@angular/core';
import { PomodoroService } from '../../../services/pomodoro.service'; // Importa il servizio

@Component({
  selector: 'app-pomodoro-report',
  templateUrl: './pomodoro-report.component.html',
  styleUrls: ['./pomodoro-report.component.css']
})
export class PomodoroReportComponent implements OnInit {
  report: any;
  @Input() visualMode: number = 0; // Modalità di visualizzazione corrente

  constructor(private pomodoroService: PomodoroService) {}

  ngOnInit(): void {
    // Recupera il report dell'ultimo Pomodoro dal servizio
    this.pomodoroService.getLastPomodoro().subscribe((data) => {
      this.report = data;
    });
  }

  // Modalità di visualizzazione differenti
  get currentView() {
    switch (this.visualMode) {
      case 0:
        return 'Visualizzazione 1';
      case 1:
        return 'Visualizzazione 2';
      case 2:
        return 'Visualizzazione 3';
      default:
        return 'Visualizzazione Predefinita';
    }
  }
}
