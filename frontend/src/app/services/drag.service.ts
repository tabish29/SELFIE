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

  // Metodo per iniziare il trascinamento
  startDrag(event: MouseEvent, element: HTMLElement): void {
    this.isDragging = true;
    this.element = element;
    this.offsetX = event.clientX - element.getBoundingClientRect().left;
    this.offsetY = event.clientY - element.getBoundingClientRect().top;

    // Aggiungi gli eventi di movimento e rilascio
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  // Gestisce il movimento del mouse
  private onMouseMove = (event: MouseEvent): void => {
    if (this.isDragging && this.element) {
      const x = event.clientX - this.offsetX;
      const y = event.clientY - this.offsetY;
      this.element.style.left = `${x}px`;
      this.element.style.top = `${y}px`;
    }
  };

  // Termina il trascinamento
  private onMouseUp = (): void => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };
}
