import { Component } from '@angular/core';
import { DragService } from '../../services/drag.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  currentVisualMode: number = 0;

  constructor(
    private dragService: DragService
  ) { }
  
  onMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    this.dragService.startDrag(event, target);
  }

  ngOnInit(): void {
  
  }

  preNote() {
    if (this.currentVisualMode > 0) {
      this.currentVisualMode--;
    } else {
      this.currentVisualMode = 3; // Torna all'ultima modalità (ciclo)
    }
  }

  nextNote() {
    if (this.currentVisualMode < 3) {
      this.currentVisualMode++;
    } else {
      this.currentVisualMode = 0; // Ricomincia da 0
    }
  }

}
