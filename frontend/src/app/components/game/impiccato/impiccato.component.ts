import { Component } from '@angular/core';

@Component({
  selector: 'app-impiccato',
  templateUrl: './impiccato.component.html',
  styleUrls: ['./impiccato.component.css'] // Nota: "styleUrls" al plurale per riferirsi all'array di stili
})
export class ImpiccatoComponent {
  word: string = 'ANGULAR'; // Parola da indovinare
  displayedWord: string[] = Array(this.word.length).fill('_'); // Parola mostrata con spazi vuoti
  guessedLetters: string[] = []; // Lettere indovinate
  remainingAttempts: number = 6; // Tentativi rimanenti
  currentGuess: string = ''; // Lettera corrente
  isGameOver: boolean = false; // Stato del gioco
  gameOverMessage: string = ''; // Messaggio di fine partita
  hangmanImage: string = '/assets/hangman0.png'; // Percorso dell'immagine dell'impiccato

  // Metodo per gestire il tentativo di una lettera
  makeGuess(): void {
    if (this.currentGuess && !this.isGameOver) {
      const guess = this.currentGuess.toUpperCase();

      if (this.guessedLetters.includes(guess) || this.displayedWord.includes(guess)) {
        this.currentGuess = ''; // Reset se la lettera è già stata usata
        return;
      }

      this.guessedLetters.push(guess);

      if (this.word.includes(guess)) {
        for (let i = 0; i < this.word.length; i++) {
          if (this.word[i] === guess) {
            this.displayedWord[i] = guess;
          }
        }
        if (!this.displayedWord.includes('_')) {
          this.gameOver(true);
        }
      } else {
        this.remainingAttempts--;
        this.updateHangmanImage();
        if (this.remainingAttempts === 0) {
          this.gameOver(false);
        }
      }
      this.currentGuess = ''; // Reset della lettera corrente
    }
  }

  // Metodo per gestire la fine del gioco
  gameOver(won: boolean): void {
    this.isGameOver = true;
    this.gameOverMessage = won ? 'Hai vinto!' : 'Hai perso! La parola era: ' + this.word;
  }

  // Metodo per aggiornare l'immagine dell'impiccato
  updateHangmanImage(): void {
    this.hangmanImage = `/assets/hangman${6 - this.remainingAttempts}.png`;
  }

  // Metodo per resettare il gioco
  resetGame(): void {
    this.word = 'ANGULAR'; // Resetta la parola
    this.displayedWord = Array(this.word.length).fill('_');
    this.guessedLetters = [];
    this.remainingAttempts = 6;
    this.isGameOver = false;
    this.currentGuess = '';
    this.hangmanImage = '/assets/hangman0.png';
  }
}
