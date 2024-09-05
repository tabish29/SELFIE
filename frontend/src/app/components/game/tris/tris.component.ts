import { Component } from '@angular/core';

@Component({
  selector: 'app-tris',
  templateUrl: './tris.component.html',
  styleUrls: ['./tris.component.css']
})
export class TrisComponent {
  cells: string[] = Array(9).fill(null); // Celle vuote per il gioco tris
  currentPlayer: string = 'X'; // Inizia il giocatore X
  winner: string | null = null; // Variabile per memorizzare il vincitore
  isDraw: boolean = false; // Variabile per gestire il pareggio

  // Metodo per gestire il click su una cella
  makeMove(index: number): void {
    if (!this.cells[index] && !this.winner && !this.isDraw) { // Se la cella è vuota e non c'è un vincitore o pareggio
      this.cells[index] = this.currentPlayer;
      if (this.checkWinner()) {
        this.winner = this.currentPlayer;
      } else if (this.checkDraw()) {
        this.isDraw = true; // Imposta il pareggio se non ci sono più celle disponibili
      } else {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'; // Cambia turno
      }
    }
  }

  // Metodo per controllare se c'è un vincitore
  checkWinner(): boolean {
    const winningCombinations = [
      [0, 1, 2], // Orizzontale
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6], // Verticale
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8], // Diagonale
      [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (this.cells[a] && this.cells[a] === this.cells[b] && this.cells[a] === this.cells[c]) {
        return true;
      }
    }
    return false;
  }

  // Metodo per controllare se c'è un pareggio
  checkDraw(): boolean {
    return this.cells.every(cell => cell !== null) && !this.winner;
  }

  // Metodo per resettare il gioco
  resetGame(): void {
    this.cells = Array(9).fill(null); // Resetta le celle
    this.currentPlayer = 'X'; // Resetta il turno al giocatore X
    this.winner = null; // Resetta il vincitore
    this.isDraw = false; // Resetta il pareggio
  }
}

