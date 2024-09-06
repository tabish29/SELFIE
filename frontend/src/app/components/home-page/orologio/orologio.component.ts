import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orologio',
  templateUrl: './orologio.component.html',
  styleUrls: ['./orologio.component.css']
})
export class OrologioComponent implements OnInit {
  currentTime: Date = new Date();

  constructor() {}

  ngOnInit(): void {
    // Aggiorna l'orologio ogni secondo
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }
}
