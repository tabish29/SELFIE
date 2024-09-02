import { Component, OnInit } from '@angular/core';
import { WordService } from '../../../services/word.service'; // Importa il servizio

@Component({
  selector: 'app-impiccato',
  templateUrl: './impiccato.component.html',
  styleUrls: ['./impiccato.component.css']
})
export class ImpiccatoComponent implements OnInit {
  word: string = ''; // Parola da indovinare
  displayedWord: string[] = []; // Parola mostrata con spazi vuoti
  guessedLetters: string[] = []; // Lettere indovinate
  remainingAttempts: number = 6; // Tentativi rimanenti
  isGameOver: boolean = false; // Stato del gioco
  gameOverMessage: string = ''; // Messaggio di fine partita
  hangmanImage: string = '/assets/hangman1.png'; // Percorso dell'immagine dell'impiccato
  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); // Alfabeto
  currentGuess: string = ''; // Lettera corrente

  constructor(private wordService: WordService) {}

  ngOnInit(): void {
    this.loadRandomWord();
  }

  loadRandomWord(): void {
    this.wordService.getWords().subscribe(words => {
      this.word = this.getRandomWord(words);
      this.displayedWord = Array(this.word.length).fill('_');
    });
  }

  getRandomWord(words: string[]): string {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }

  makeGuess(): void {
    if (this.currentGuess && !this.isGameOver) {
      this.selectLetter(this.currentGuess.toUpperCase());
      this.currentGuess = ''; // Reset dell'input
    }
  }

  selectLetter(letter: string): void {
    if (!this.isGameOver && !this.guessedLetters.includes(letter)) {
      this.guessedLetters.push(letter);

      if (this.word.includes(letter)) {
        for (let i = 0; i < this.word.length; i++) {
          if (this.word[i] === letter) {
            this.displayedWord[i] = letter;
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
    } else if (this.guessedLetters.includes(letter)) {
      alert('Lettera già provata!');
    }
  }

  gameOver(won: boolean): void {
    this.isGameOver = true;
    this.gameOverMessage = won ? 'Hai vinto!' : 'Hai perso! La parola era: ' + this.word;
  }

  updateHangmanImage(): void {
    this.hangmanImage = `/assets/hangman${7 - this.remainingAttempts}.png`;
  }

  resetGame(): void {
    this.loadRandomWord();
    this.guessedLetters = [];
    this.remainingAttempts = 6;
    this.isGameOver = false;
    this.currentGuess = '';
    this.hangmanImage = '/assets/hangman1.png';
  }
}
