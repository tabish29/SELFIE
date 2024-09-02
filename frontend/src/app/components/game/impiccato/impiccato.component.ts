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
    this.loadRandomWord(); // Carica una parola casuale all'inizio del gioco
  }

  // Metodo per caricare una parola casuale dal servizio
  loadRandomWord(): void {
    this.wordService.getRandomWord().subscribe(word => {
      this.word = word; // Usa la parola esattamente come viene fornita
      this.displayedWord = Array(this.word.length).fill('_'); // Inizializza la parola mostrata
      console.log('Parola caricata:', this.word); // Mostra la parola caricata nella console
    });
  }

  // Metodo per gestire il tentativo di una lettera
  makeGuess(): void {
    if (this.currentGuess && !this.isGameOver) {
      this.selectLetter(this.currentGuess);
      this.currentGuess = ''; // Reset dell'input
    }
  }

  // Metodo per selezionare una lettera dall'alfabeto
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

  // Metodo per gestire la fine del gioco
  gameOver(won: boolean): void {
    this.isGameOver = true;
    this.gameOverMessage = won ? 'Hai vinto!' : 'Hai perso! La parola era: ' + this.word;
  }

  // Metodo per aggiornare l'immagine dell'impiccato
  updateHangmanImage(): void {
    this.hangmanImage = `/assets/hangman${7 - this.remainingAttempts}.png`;
  }

  // Metodo per resettare il gioco
  /*resetGame(): void {
    this.loadRandomWord(); // Carica una nuova parola casuale
    this.guessedLetters = [];
    this.remainingAttempts = 6;
    this.isGameOver = false;
    this.currentGuess = '';
    this.hangmanImage = '/assets/hangman1.png';
  }*/
  resetGame(): void {
    // Ricarica la pagina
    window.location.reload();
  }

}
