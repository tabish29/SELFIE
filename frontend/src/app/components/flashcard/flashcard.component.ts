import { Component } from '@angular/core';
import { FlashcardSet } from '../../models/FlashcardSet';
import { FlashcardService } from '../../services/flashcard.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTopicDialogComponent } from './update-topic-dialog/update-topic.component';
import { UpdateFlashcardDialogComponent } from './update-flashcard-dialog/update-flashcard-dialog.component';
import { DragService } from '../../services/drag.service';

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

  constructor(
    private flashcardService: FlashcardService, 
    private localStorageService: LocalStorageService, 
    private dialog: MatDialog,
    private dragService: DragService
  ) { }
  
  onMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    this.dragService.startDrag(event, target);
  }

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
      console.log("Non c'è il set per il topic selezionato");
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

  deleteTopic(topic: string): void {
    if (confirm(`Sei sicuro di voler eliminare il topic "${topic}"?`)) {

      this.flashcardService.deleteFlashcardSet(this.author, topic).subscribe(() => {
        this.loadFlashcards();
        this.selectedTopic = '';
        this.currentFlashcard = null;
      }, (error) => {
        console.error('Errore durante l\'eliminazione del topic:', error);
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

            if (!this.currentFlashcard && selectedSet.flashcards.length > 0) {
              this.currentFlashcardIndex = 0;
              this.currentFlashcard = selectedSet.flashcards[this.currentFlashcardIndex];
            }

            console.log('Flashcard aggiunta con successo!');
          },
          (error) => {
            console.error('Errore durante l\'aggiunta della flashcard:', error);
          }
        );
      }
    } else {
      console.error('Domanda e risposta non possono essere vuoti.');
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
        this.currentFlashcard = null;
      } else if (this.currentFlashcard && this.currentFlashcard.question === question) {

        this.currentFlashcardIndex = 0;
        this.currentFlashcard = selectedSet.flashcards[this.currentFlashcardIndex];
        this.isFlipped = false;

      }

    }
  }

  updateTopic(oldTopicName: string): void {
    const dialogRef = this.dialog.open(UpdateTopicDialogComponent, {
      width: '800px',
      data: { topicName: oldTopicName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const oldTopicname = result.oldTopicName;
        const newTopicName = result.newTopicName;

        this.flashcardService.updateFlashcardSetTopic(this.author, oldTopicName, newTopicName).subscribe(
          response => {
            console.log('Topic aggiornato con successo!')

            const updatedSet = this.flashcardSets.find(set => set.topic === oldTopicName);
            if (updatedSet) {
              updatedSet.topic = newTopicName;
              this.selectedTopic = newTopicName;
            }


            this.loadFlashcards();
          },
          error => console.error('Errore durante l\'aggiornamento del topic', error)
        );
      }
    });
  }

  openUpdateFlashcardDialog(flashcard: any): void {
    const dialogRef = this.dialog.open(UpdateFlashcardDialogComponent, {
      width: '800px',
      data: { flashcard: flashcard }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { oldQuestion, newQuestion, newAnswer } = result;

        this.flashcardService.updateFlashcard(this.author, this.selectedTopic, oldQuestion, newQuestion, newAnswer).subscribe(
          response => {
            console.log('Flashcard aggiornata con successo!');
            this.updateFlashcardLocally(this.selectedTopic, oldQuestion, newQuestion, newAnswer);
            this.loadFlashcards();
          },
          error => console.error('Errore durante l\'aggiornamento della flashcard', error)
        );

      }
    });
  }

  updateFlashcardLocally(topic: string, oldQuestion: string, newQuestion: string, newAnswer: string): void {
    const selectedSet = this.flashcardSets.find(set => set.topic === topic && set.author === this.author);
    if (selectedSet) {
      const flashcardIndex = selectedSet.flashcards.findIndex(fc => fc.question === oldQuestion);
      if (flashcardIndex !== -1) {
        const flashcard = selectedSet.flashcards[flashcardIndex];
        selectedSet.flashcards[flashcardIndex] = {
          ...flashcard,
          question: newQuestion || flashcard.question,
          answer: newAnswer || flashcard.answer
        };

        if (this.currentFlashcard && this.currentFlashcard.question === oldQuestion) {
          this.currentFlashcard = {
            ...this.currentFlashcard,
            question: newQuestion || this.currentFlashcard.question,
            answer: newAnswer || this.currentFlashcard.answer
          };
        }
      }
    }
  }

}