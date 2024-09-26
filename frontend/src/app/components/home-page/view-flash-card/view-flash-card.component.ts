import { Component, Input, OnInit } from '@angular/core';
import { FlashcardService } from '../../../services/flashcard.service'; // Importa il servizio delle flashcard
import { FlashcardSet } from '../../../models/FlashcardSet'; // Importa il modello della flashcard

@Component({
  selector: 'app-view-flash-card',
  templateUrl: './view-flash-card.component.html',
  styleUrls: ['./view-flash-card.component.css'] // Corretto "styleUrl" in "styleUrls"
})
export class ViewFlashCardComponent implements OnInit {
  @Input() visualMode: number = 0; // Modalità di visualizzazione corrente
  topics: string[] = []; // Elenco di tutti i topic
  flashcardSets: FlashcardSet[] = []; // Elenco dei set di flashcard divisi per topic

  constructor(private flashcardService: FlashcardService) {}

  ngOnInit(): void {
    this.loadFlashcards(); // Carica i dati delle flashcard quando il componente viene inizializzato
  }

  // Carica le flashcard dal servizio
  loadFlashcards(): void {
    this.flashcardService.getFlashcardsByAuthor('Leo').subscribe(
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
