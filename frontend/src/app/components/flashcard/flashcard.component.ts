import { Component } from '@angular/core';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrl: './flashcard.component.css'
})
export class FlashcardComponent {
  isFlipped: boolean = false;
  question: string = 'Qual è la capitale della Francia?';
  answer: string = 'La capitale della Francia è Parigi.'; 

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }

}
