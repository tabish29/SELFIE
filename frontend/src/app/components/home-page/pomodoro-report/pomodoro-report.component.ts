import { Component, OnInit } from '@angular/core';
import { PomodoroService } from '../../../services/pomodoro.service'; // Importa il servizio

@Component({
  selector: 'app-pomodoro-report',
  templateUrl: './pomodoro-report.component.html',
  styleUrls: ['./pomodoro-report.component.css']
})
export class PomodoroReportComponent implements OnInit {
  report: any;

  constructor(private pomodoroService: PomodoroService) {}

  ngOnInit(): void {
    // Recupera il report dell'ultimo Pomodoro dal servizio
    this.pomodoroService.getLastPomodoro().subscribe((data) => {
      this.report = data;
    });
  }
}
