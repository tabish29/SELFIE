import { Component } from '@angular/core';
import { FlashcardSet } from '../../models/FlashcardSet';
import { FlashcardService } from '../../services/flashcard.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.css'
})
export class FlashcardComponent {
  author: string = '';
  isFlipped: boolean = false;
  flashcardSets: FlashcardSet[] = [];
  selectedTopic: string = '';
  currentFlashcardIndex: number = 0;
  currentFlashcard: any = null;
  newTopic: string = '';
  newQuestion: string = '';
  newAnswer: string = '';

  constructor(private flashcardService: FlashcardService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.author = this.localStorageService.getItem('username');
    this.loadFlashcards();
  }

  loadFlashcards(): void {
    if (this.author) {
      this.flashcardService.getFlashcardsByAuthor(this.author).subscribe(
        (flashcardSets) => {
          this.flashcardSets = flashcardSets;
        },
        (error) => {
          console.error('Errore nel caricamento dei flashcard set:', error);
        }
      );
    }
  }

  onTopicChange(): void {
    const selectedSet = this.flashcardSets.find(set => set.topic === this.selectedTopic);
    if (selectedSet) {
      this.currentFlashcardIndex = 0;
      this.currentFlashcard = selectedSet.flashcards[this.currentFlashcardIndex];
    } else {
      console.log("non si riesce a trovare il set per il topic selezionato");
    }
  }

  addTopic(): void {
    if (this.newTopic) {
      this.flashcardService.addTopic(this.author, this.newTopic).subscribe(() => {
        this.loadFlashcards();
        this.newTopic = '';
      });
    }
  }

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

  nextFlashcard(): void {
    const selectedSet = this.flashcardSets.find(set => set.topic === this.selectedTopic);
    if (selectedSet) {
      this.currentFlashcardIndex = (this.currentFlashcardIndex + 1) % selectedSet.flashcards.length;
      this.currentFlashcard = selectedSet.flashcards[this.currentFlashcardIndex];
      this.isFlipped = false;
    }
  }

  prevFlashcard(): void {
    const selectedSet = this.flashcardSets.find(set => set.topic === this.selectedTopic);
    if (selectedSet) {
      this.currentFlashcardIndex = (this.currentFlashcardIndex - 1 + selectedSet.flashcards.length) % selectedSet.flashcards.length;
      this.currentFlashcard = selectedSet.flashcards[this.currentFlashcardIndex];
      this.isFlipped = false;
    }
  }

  addFlashcard(): void {
    if (this.newQuestion.trim() !== '' && this.newAnswer.trim() !== '') {
      const selectedSet = this.flashcardSets.find(set => set.topic === this.selectedTopic && set.author == this.author);
      if (selectedSet) {
        selectedSet.flashcards.push({ question: this.newQuestion, answer: this.newAnswer });

        this.flashcardService.createFlashcardSet(selectedSet).subscribe(
          () => {
            this.newQuestion = '';
            this.newAnswer = '';
            console.log('Flashcard aggiunta con successo!');
          },
          (error) => {
            console.error('Errore durante l\'aggiunta della flashcard:', error);
          }
        );
      }
    } else {
      console.warn('Domanda e risposta non possono essere vuoti.');
    }
  }

  deleteFlashcard(flashcard: any): void {
    if (this.selectedTopic && flashcard) {
      this.flashcardService.deleteFlashcard(this.author, this.selectedTopic, flashcard.question).subscribe(() => {
        this.removeFlashcardLocally(flashcard.question);
      });

    }
  }

  removeFlashcardLocally(question: string): void {
    const selectedSet = this.flashcardSets.find(set => set.topic === this.selectedTopic);
    if (selectedSet) {
      selectedSet.flashcards = selectedSet.flashcards.filter(flashcard => flashcard.question !== question);

      if (selectedSet.flashcards.length === 0) {

        this.flashcardSets = this.flashcardSets.filter(set => set.topic !== this.selectedTopic);
        this.selectedTopic = '';
        this.currentFlashcard = null;

      } else if (this.currentFlashcard && this.currentFlashcard.question === question) {

        this.currentFlashcardIndex = 0;
        this.currentFlashcard = selectedSet.flashcards[this.currentFlashcardIndex];
        this.isFlipped = false;

      }
    }
  }

}