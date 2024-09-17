import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DragService } from '../../services/drag.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {

  constructor(
    private dragService: DragService,
    private router: Router
  ) { }
  
  onMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    this.dragService.startDrag(event, target);
  }

  goToGame(gameName: string): void {
    this.router.navigate(['/game', gameName]);
  }
}
