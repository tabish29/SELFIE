import { Component } from '@angular/core';
import { DragService } from '../../../services/drag.service';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.css']
})
export class PuzzleComponent {
  puzzle: (number | null)[] = []; // Inizializza la proprietà 'puzzle'
  isSolved: boolean = false; // Definisce la proprietà 'isSolved'

  constructor(
    private dragService: DragService
  ) { 
    this.resetPuzzle(); // Inizializza il puzzle
  }
  
  onMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    this.dragService.startDrag(event, target);
  }

  // Metodo per resettare il puzzle
  resetPuzzle(): void {
    this.puzzle = this.generatePuzzle();
    this.isSolved = false;
  }

  // Genera il puzzle con i numeri mescolati
  generatePuzzle(): (number | null)[] {
    const tiles: (number | null)[] = Array.from({ length: 15 }, (_, i) => i + 1);
    tiles.push(null); // Aggiungi lo spazio vuoto
    return this.shuffleArray(tiles);
  }

  // Mescola l'array per creare il puzzle
  shuffleArray(array: (number | null)[]): (number | null)[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Gestisce il movimento delle tessere
  moveTile(index: number): void {
    const emptyIndex = this.puzzle.indexOf(null);
    const validMoves = [
      emptyIndex - 1, emptyIndex + 1, 
      emptyIndex - 4, emptyIndex + 4
    ];

    if (validMoves.includes(index)) {
      [this.puzzle[emptyIndex], this.puzzle[index]] = 
      [this.puzzle[index], this.puzzle[emptyIndex]];
    }

    this.isSolved = this.checkIfSolved();
  }

  // Controlla se il puzzle è stato completato
  checkIfSolved(): boolean {
    for (let i = 0; i < 15; i++) {
      if (this.puzzle[i] !== i + 1) {
        return false;
      }
    }
    return true;
  }
}
