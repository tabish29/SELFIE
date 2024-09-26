import { Component } from '@angular/core';
import { DragService } from '../../services/drag.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  currentNoteVisualMode: number = 0;
  currentEventiVisualMode: number = 0;
  currentPomodoroVisualMode: number = 0;
  currentCardVisualMode: number = 0;

  constructor(
    private dragService: DragService,
    private localStorageService: LocalStorageService
  ) { }
  ngOnInit(): void {
    // Recupera gli stati dal localStorage al caricamento della pagina
    const savedNoteVisualMode = this.localStorageService.getItem('noteVisualMode');
    if (savedNoteVisualMode !== null) {
      this.currentNoteVisualMode = Number(savedNoteVisualMode);
    }

    const savedEventiVisualMode = this.localStorageService.getItem('eventiVisualMode');
    if (savedEventiVisualMode !== null) {
      this.currentEventiVisualMode = Number(savedEventiVisualMode);
    }

    const savedCardVisualMode = this.localStorageService.getItem('flashCardVisualMode');
    if (savedCardVisualMode !== null) {
      this.currentCardVisualMode = Number(savedCardVisualMode);
    }
  }
  onMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    this.dragService.startDrag(event, target);
  }

  preNote() {
    if (this.currentNoteVisualMode > 0) {
      this.currentNoteVisualMode--;
    } else {
      this.currentNoteVisualMode = 2; // Torna all'ultima modalità (ciclo)
    }
    this.localStorageService.setItem('noteVisualMode', String(this.currentNoteVisualMode)); // Salva lo stato nel localStorage
  }

  nextNote() {
    if (this.currentNoteVisualMode < 2) {
      this.currentNoteVisualMode++;
    } else {
      this.currentNoteVisualMode = 0; // Ricomincia da 0
    }
    this.localStorageService.setItem('noteVisualMode', String(this.currentNoteVisualMode)); // Salva lo stato nel localStorage
  }

  // Funzioni per la navigazione degli Eventi imminenti
  preEventi() {
    if (this.currentEventiVisualMode > 0) {
      this.currentEventiVisualMode--;
    } else {
      this.currentEventiVisualMode = 2; 
    }
    this.localStorageService.setItem('eventiVisualMode', String(this.currentEventiVisualMode)); // Salva lo stato nel localStorage
  }

  nextEventi() {
    if (this.currentEventiVisualMode < 2) {
      this.currentEventiVisualMode++;
    } else {
      this.currentEventiVisualMode = 0; // Ricomincia da 0
    }
    this.localStorageService.setItem('eventiVisualMode', String(this.currentEventiVisualMode)); // Salva lo stato nel localStorage
  }
  
  // Funzioni per la navigazione del report flash-card
  preCard() {
    if (this.currentCardVisualMode > 0) {
      this.currentCardVisualMode--;
    } else {
      this.currentCardVisualMode = 2; // Cicla all'ultima modalità per il pomodoro
    }
    this.localStorageService.setItem('flashCardVisualMode', String(this.currentCardVisualMode)); // Salva lo stato nel localStorage
  }

  nextCard() {
    if (this.currentCardVisualMode < 2) {
      this.currentCardVisualMode++;
    } else {
      this.currentCardVisualMode = 0; // Ricomincia da 0
    }
    this.localStorageService.setItem('flashCardVisualMode', String(this.currentCardVisualMode)); // Salva lo stato nel localStorage
  }
}