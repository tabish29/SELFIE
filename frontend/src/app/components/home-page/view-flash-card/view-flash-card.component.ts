import { Component, Input, OnInit } from '@angular/core';
import { FlashcardService } from '../../../services/flashcard.service'; // Importa il servizio delle flashcard
import { FlashcardSet } from '../../../models/FlashcardSet'; // Importa il modello della flashcard
import { LocalStorageService } from '../../../services/local-storage.service'; // Servizio per gestione localStorage

@Component({
  selector: 'app-view-flash-card',
  templateUrl: './view-flash-card.component.html',
  styleUrls: ['./view-flash-card.component.css'] // Corretto "styleUrl" in "styleUrls"
})
export class ViewFlashCardComponent implements OnInit {
  @Input() visualMode: number = 0; // Modalità di visualizzazione corrente
  topics: string[] = []; // Elenco di tutti i topic
  flashcardSets: FlashcardSet[] = []; // Elenco dei set di flashcard divisi per topic
  authorUsername: string = '';

  constructor(
    private flashcardService: FlashcardService,
    private localStorageService: LocalStorageService, // Iniezione del servizio LocalStorage
  ) {}

  ngOnInit(): void {
    // Recupera l'username dal localStorage
    this.authorUsername = this.localStorageService.getItem('username');

    // Recupera il visualMode salvato nel localStorage
    const savedVisualMode = this.localStorageService.getItem('flashCardVisualMode');
    if (savedVisualMode !== null) {
      this.visualMode = Number(savedVisualMode); // Imposta il visualMode salvato
    }

    this.loadFlashcards(); // Carica i dati delle flashcard
  }
  
  // Metodo per cambiare il visualMode e salvarlo nel localStorage
  changeVisualMode(newMode: number): void {
    this.visualMode = newMode;
    this.localStorageService.setItem('flashCardVisualMode', String(this.visualMode));
  }

  // Carica le flashcard dal servizio
  loadFlashcards(): void {
    this.flashcardService.getFlashcardsByAuthor(this.authorUsername).subscribe(
      (flashcardSets: FlashcardSet[]) => {
        this.flashcardSets = flashcardSets;
        this.topics = flashcardSets.map(set => set.topic); // Estrae tutti i topic
      },
      error => {
        console.error('Errore nel caricamento delle flashcard:', error);
      }
    );
  }

  // Funzione per ottenere la visualizzazione corrente in base al visualMode
  get currentView(): string {
    switch (this.visualMode) {
      case 0:
        return 'Visualizzazione: Tutti i Topic';
      case 1:
        return 'Visualizzazione: Domande per ogni Topic';
      case 2:
        return 'Visualizzazione: Risposte per ogni Topic';
      default:
        return 'Visualizzazione Predefinita';
    }
  }
}
