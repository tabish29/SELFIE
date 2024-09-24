import { Component } from '@angular/core';
import { DragService } from '../../services/drag.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  currentNoteVisualMode: number = 0;
  currentEventiVisualMode: number = 0;
  currentPomodoroVisualMode: number = 0;
  currentOrologioVisualMode: number = 0;

  constructor(
    private dragService: DragService
  ) { }
  
  onMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    this.dragService.startDrag(event, target);
  }

  ngOnInit(): void {
  
  }

  preNote() {
    if (this.currentNoteVisualMode > 0) {
      this.currentNoteVisualMode--;
    } else {
      this.currentNoteVisualMode = 2; // Torna all'ultima modalità (ciclo)
    }
  }

  nextNote() {
    if (this.currentNoteVisualMode < 2) {
      this.currentNoteVisualMode++;
    } else {
      this.currentNoteVisualMode = 0; // Ricomincia da 0
    }
  }
  // Funzioni per la navigazione degli Eventi imminenti
  preEventi() {
    if (this.currentEventiVisualMode > 0) {
      this.currentEventiVisualMode--;
    } else {
      this.currentEventiVisualMode = 2; 
    }
  }

  nextEventi() {
    if (this.currentEventiVisualMode < 2) {
      this.currentEventiVisualMode++;
    } else {
      this.currentEventiVisualMode = 0; // Ricomincia da 0
    }
  }

  // Funzioni per la navigazione del report pomodoro
  prePomodoro() {
    if (this.currentPomodoroVisualMode > 0) {
      this.currentPomodoroVisualMode--;
    } else {
      this.currentPomodoroVisualMode = 2; // Cicla all'ultima modalità per il pomodoro
    }
  }

  nextPomodoro() {
    if (this.currentPomodoroVisualMode < 2) {
      this.currentPomodoroVisualMode++;
    } else {
      this.currentPomodoroVisualMode = 0; // Ricomincia da 0
    }
  }

}