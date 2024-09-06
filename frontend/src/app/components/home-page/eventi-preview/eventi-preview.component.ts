import { Component, OnInit } from '@angular/core';
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
}
