// drag.service.ts
import { Injectable, HostListener } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DragService {
  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;
  private element: HTMLElement | null = null;

  constructor() {}

  startDrag(event: MouseEvent, element: HTMLElement) {
    this.isDragging = true;
    this.element = element;

    // Calcola l'offset iniziale del mouse rispetto all'elemento
    this.offsetX = event.clientX - element.getBoundingClientRect().left;
    this.offsetY = event.clientY - element.getBoundingClientRect().top;

    // Aggiungi gli eventi mousemove e mouseup
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  private onMouseMove(event: MouseEvent) {
    if (this.isDragging && this.element) {
      // Sposta l'elemento mantenendo le dimensioni fisse
      this.element.style.left = `${event.clientX - this.offsetX}px`;
      this.element.style.top = `${event.clientY - this.offsetY}px`;
      this.element.style.right = 'auto'; // Rimuovi allineamento a destra per abilitare il movimento
      this.element.style.bottom = 'auto'; // Rimuovi allineamento in basso per abilitare il movimento
    }
  }

  private onMouseUp() {
    // Ferma il trascinamento
    this.isDragging = false;
    this.element = null;

    // Rimuovi gli eventi mousemove e mouseup
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }
}
