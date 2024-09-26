import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-flash-card',
  templateUrl: './view-flash-card.component.html',
  styleUrl: './view-flash-card.component.css'
})
export class ViewFlashCardComponent {

  report: any;
  @Input() visualMode: number = 0; // Modalità di visualizzazione corrente

  constructor(
    
  ) {}

  ngOnInit(): void {
    
  }

  // Modalità di visualizzazione differenti
  get currentView() {
    switch (this.visualMode) {
      case 0:
        return 'Visualizzazione 1';
      case 1:
        return 'Visualizzazione 2';
      case 2:
        return 'Visualizzazione 3';
      default:
        return 'Visualizzazione Predefinita';
    }
  }
}
