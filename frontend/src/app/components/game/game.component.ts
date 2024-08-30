import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  cells: (null | 'X' | 'O')[] = Array(9).fill(null);
  currentPlayer: 'X' | 'O' = 'X';
  gameStatus: string = '';

  makeMove(index: number): void {
    if (this.cells[index] || this.gameStatus) return;

    this.cells[index] = this.currentPlayer;
    const winner = this.checkWinner();

    if (winner) {
      this.gameStatus = winner === 'T' ? 'Pareggio!' : `Vince ${winner}!`;
    } else {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  checkWinner(): 'X' | 'O' | 'T' | null {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (const [a, b, c] of winningCombinations) {
      if (this.cells[a] && this.cells[a] === this.cells[b] && this.cells[a] === this.cells[c]) {
        return this.cells[a];
      }
    }

    return this.cells.every(cell => cell !== null) ? 'T' : null;
  }

  resetGame(): void {
    this.cells = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.gameStatus = '';
  }
}
