import { Component, Input, OnInit } from '@angular/core';
import { EventService } from '../../../services/event.service'; // Importa il servizio eventi
import { TimeMachineService } from '../../../services/time-machine.service'; // Importa il servizio time machine
import { Event } from '../../../models/Event'; // Modello per gli eventi
import { LocalStorageService } from '../../../services/local-storage.service'; // Servizio local storage
import { TimeMachine } from '../../../models/TimeMachine'; // Modello per la time machine

@Component({
  selector: 'app-eventi-preview',
  templateUrl: './eventi-preview.component.html',
  styleUrls: ['./eventi-preview.component.css']
})
export class EventiPreviewComponent implements OnInit {
  @Input() visualMode: number = 0; // Modalità di visualizzazione corrente
  events: Event[] = []; // Array per tutti gli eventi
  monthlyEvents: Event[] = []; // Array per gli eventi mensili
  weeklyEvents: Event[] = []; // Array per gli eventi settimanali
  dailyEvents: Event[] = []; // Array per gli eventi giornalieri
  selectedEvent: Event | null = null; // Evento selezionato
  authorUsername: string = ''; // Username dell'autore
  today: Date = new Date(); // Data corrente del PC da cambiare in data ottenuta dalla TimeMachine

  constructor(
    private eventService: EventService, // Servizio eventi
    private localStorageService: LocalStorageService, // Servizio local storage
    private timeMachineService: TimeMachineService // Servizio time machine
  ) { }

  ngOnInit(): void {
    // Recupera lo username dell'autore dall'archiviazione locale
    this.authorUsername = this.localStorageService.getItem('username');
    // Recupera il visualMode salvato nel localStorage
    const savedVisualMode = this.localStorageService.getItem('eventiVisualMode');
    if (savedVisualMode !== null) {
      this.visualMode = Number(savedVisualMode);
    }
    // Se l'username esiste, carica gli eventi relativi all'autore e la data dalla TimeMachine
    if (this.authorUsername) {
      this.loadTimeMachineDate(); // Carica la data dalla TimeMachine
    } else {
      console.log("Non esiste l'username dell'autore");
    }
  }
  
  // Cambia modalità e salva lo stato nel localStorage
  changeVisualMode(newMode: number): void {
    this.visualMode = newMode;
    this.localStorageService.setItem('eventiVisualMode', String(this.visualMode));
  }

  // Carica la data corrente dalla TimeMachine
  loadTimeMachineDate(): void {
    this.timeMachineService.getTimeMachine(this.authorUsername).subscribe(
      (timeMachine: TimeMachine) => {
        var temp = timeMachine.date.slice(0, 10); // Converte la stringa in formato YYYY-MM-DD
        var d = temp.substring(0,2);
        var m = temp.substring(3,5);
        var y = temp.substring(6,10);
    
        this.today = new Date(y+"-"+m+"-"+d); 
        //console.log("Controllo 1 data TM:",this.today);
        this.loadEventsByAuthor(this.authorUsername); // Carica gli eventi dell'autore dopo aver ottenuto la data
      },
      error => {
        console.error('Errore durante il recupero della time machine:', error);
      }
    );
    // Sottoscrivi all'osservabile per ascoltare gli aggiornamenti in tempo reale
    this.timeMachineService.timeMachineObservable.subscribe(
      (updatedTimeMachine: TimeMachine | null) => {
        if (updatedTimeMachine) {
          var temp = updatedTimeMachine.date.slice(0,10);
          var d = temp.substring(0,2);
          var m = temp.substring(3,5);
          var y = temp.substring(6,10);
          this.today = new Date(y+"-"+m+"-"+d); 
          
          this.loadEventsByAuthor(this.authorUsername);//Metodo di aggiornamento
          //console.log('TimeMachine aggiornata: ', updatedTimeMachine.date);
        } else {
          console.error('Nessuna TimeMachine disponibile');
        }
      }
    );
  }

  // Metodo per caricare gli eventi relativi all'autore
  loadEventsByAuthor(authorUsername: string): void {
    this.eventService.getEventsByAuthor(authorUsername).subscribe(
      (events: Event[]) => {
        this.events = events;
        //console.log(events);
        this.events.forEach(event => {
          const isFullDayEvent = this.isAllDay(event);
          console.log(`Evento: ${event.title} - isFullDay: ${isFullDayEvent}`);
          if(isFullDayEvent){
            var dt = new Date(event.dateEnd);
            dt.setUTCDate(dt.getUTCDate() + 1);
            event.dateEnd = dt;
          }
        });
        this.filterEvents();  // Metodo per filtrare gli eventi mensili, settimanali e giornalieri
        //this.selectLatestEvent();  // Metodo per selezionare l'ultimo evento
      },
      error => console.error('Errore nel caricamento degli eventi dell\'autore', error)
    );
  }
  private isAllDay(event: Event): boolean{
    if(event.dateStart == event.dateEnd){
      return true;
    }else {
      return false;
    }
  }
  // Metodo per filtrare eventi in base a giorno, settimana e mese
  filterEvents(): void {
    // Filtra eventi mensili
    this.monthlyEvents = this.events.filter(event => {
      const eventDate = new Date(event.dateStart).toISOString().slice(0, 7); // YYYY-MM
      //console.log("controllo:", eventDate,this.today.toISOString().slice(0, 7))
      return eventDate === this.today.toISOString().slice(0, 7); // Verifica mese e anno
    });

    // Filtra eventi settimanali
    const weekStart = this.getStartOfWeek(this.today);
    const weekEnd = this.addDays(weekStart, 6); // Fine settimana
    //console.log(weekStart, "-" , weekEnd);
    this.weeklyEvents = this.events.filter(event => {
      const eventDate = new Date(event.dateStart).toISOString().slice(0, 10); // YYYY-MM-DD
      return eventDate >= weekStart && eventDate <= weekEnd;
    });

    // Filtra eventi giornalieri
    this.dailyEvents = this.events.filter(event => {
      const eventDate = new Date(event.dateEnd).toISOString().slice(0, 10); // YYYY-MM-DD
      //console.log("evento:: ", event, eventDate, "oggi", this.today.toISOString().slice(0,10));
      return eventDate === this.today.toISOString().slice(0,10);
    });

    console.log('Eventi mensili:', this.monthlyEvents);
    console.log('Eventi settimanali:', this.weeklyEvents);
    console.log('Eventi giornalieri:', this.dailyEvents);
  }

  // Metodo per ottenere l'inizio della settimana corrente (basato su YYYY-MM-DD)
  getStartOfWeek(dateString: Date): string {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay(); // Giorno della settimana (0 = Domenica, 1 = Lunedì, ecc.)
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Calcola l'inizio della settimana (lunedì)
    date.setDate(diff);
    return date.toISOString().slice(0, 10); // Ritorna la data in formato YYYY-MM-DD
  }

  // Metodo per aggiungere giorni a una data (in formato stringa YYYY-MM-DD)
  addDays(dateString: string, days: number): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10); // Ritorna la data in formato YYYY-MM-DD
  }

  // Modalità di visualizzazione differenti
  get currentView() {
    switch (this.visualMode) {
      case 0:
        return 'Visualizzazione mensile';
      case 1:
        return 'Visualizzazione giornaliera';
      case 2:
        return 'Visualizzazione settimanale';
      default:
        return 'Visualizzazione Predefinita';
    }
  }
}
