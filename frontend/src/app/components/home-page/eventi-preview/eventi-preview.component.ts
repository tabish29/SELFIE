import { Component, Input, OnInit } from '@angular/core';
import { EventService } from '../../../services/event.service'; // Importa il service

@Component({
  selector: 'app-eventi-preview',
  templateUrl: './eventi-preview.component.html',
  styleUrls: ['./eventi-preview.component.css']
})
export class EventiPreviewComponent implements OnInit {
  eventi: any[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
   
  }

  @Input() visualMode: number = 0; // Modalità di visualizzazione corrente

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
