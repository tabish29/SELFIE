import { Component } from '@angular/core';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css']
})
export class SudokuComponent {
  sudokuBoxes: Array<Array<Array<{ value: string }>>> = [];

  constructor() {
    this.initializeBoard();
  }

  initializeBoard() {
    this.sudokuBoxes = Array.from({ length: 9 }, () => 
      Array.from({ length: 3 }, () => 
        Array.from({ length: 3 }, () => ({ value: '' }))
      )
    );

    // Puoi aggiungere qui i valori iniziali per la visualizzazione
    this.sudokuBoxes[0][0][0].value = '5'; // Esempio: imposta il primo valore del primo quadrato
  }
}
