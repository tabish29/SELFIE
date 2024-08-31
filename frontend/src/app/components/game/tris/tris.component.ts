import { Component } from '@angular/core';

@Component({
  selector: 'app-tris',
  templateUrl: './tris.component.html',
  styleUrls: ['./tris.component.css']
})
export class TrisComponent {
  cells: string[] = Array(9).fill(null); // Cella vuota per il gioco tris
  currentPlayer: string = 'X'; // Inizia il giocatore X

  // Metodo per gestire il click su una cella
  makeMove(index: number): void {
    if (!this.cells[index]) { // Se la cella è vuota
      this.cells[index] = this.currentPlayer;
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'; // Cambia turno
    }
  }

  // Metodo per resettare il gioco
  resetGame(): void {
    this.cells = Array(9).fill(null); // Resetta le celle
    this.currentPlayer = 'X'; // Resetta il turno al giocatore X
  }
}

