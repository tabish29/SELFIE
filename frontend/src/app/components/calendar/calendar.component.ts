import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';  
import listPlugin from '@fullcalendar/list';        
import interactionPlugin from '@fullcalendar/interaction';  
import rrulePlugin from '@fullcalendar/rrule';

import { Component , signal, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular'; 
import { CalendarOptions, EventClickArg, EventApi } from '@fullcalendar/core';
import { MatDialog } from '@angular/material/dialog';
import { NewActivityDialogComponent } from '../new-activity-dialog/new-activity-dialog.component';
import { NewEventDialogComponent } from '../new-event-dialog/new-event-dialog.component';

import { Activity } from '../../models/Activity';
import { Event } from '../../models/Event';
import { ActivityService } from '../../services/activity.service';
import { EventService } from '../../services/event.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { TimeMachineService } from '../../services/time-machine.service';
import { TimeMachine } from '../../models/TimeMachine';
import { DragService } from '../../services/drag.service';





@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})

export class CalendarComponent {
  @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;  //per accedere al componente FullCalendar nel DOM.
  
  constructor(
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private activityService: ActivityService,
    private eventService: EventService,
    private localStorageService: LocalStorageService,
    private timeMachineService: TimeMachineService,
    private dragService: DragService
  ) {}

  activities: Activity[] = [];
  events: Event[] = [];
  authorUsername: string = '';
  today: string = '';
  calendarInitialized = false;
  currentEvents = signal<EventApi[]>([]);
  calendarVisible = signal(true);

  calendarOptions = signal<CalendarOptions>({
    plugins: [
      //per cambiamento vista del calendario
      dayGridPlugin,  
      timeGridPlugin, 
      listPlugin,
      interactionPlugin,  //interazione con eventi sul calendario
      rrulePlugin  //ripetizione eventi
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    customButtons:{
      today:{
        text: 'Today',
        click: this.goToCustomDate.bind(this)
      }
    },
    initialView: 'dayGridMonth',
    //initialDate: new Date(),
    weekends: true,
    editable: false, //drag-end-drop degli eventi
    selectable: false,  //selezione giorno
    selectMirror: false,
    dayMaxEvents: true, //se troppi eventi: visualizza +n eventi
    timeZone: 'local',
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    
  });


  public ngOnInit(): void {
    
    this.authorUsername = this.localStorageService.getItem('username') || '';
    if (!this.authorUsername) {
      console.error('Username is missing');
    }

    this.loadTimeMachine();
  }

  // Spostamento time-machine
  public onMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    this.dragService.startDrag(event, target);
  }

  // Gestisce l'interazione con i cambiamenti della time-machine
  private loadTimeMachine(): void {
   //recupera dati iniziali della time-machine
     this.timeMachineService.getTimeMachine(this.authorUsername).subscribe(
      (timeMachine) => {
        this.today = this.convertToDateTimeLocalFormat(timeMachine.date); 
        this.goToCustomDate(); // Vai alla data iniziale
      },
      (error) => console.error('Errore nel recupero della TimeMachine', error)
    );

    //notifica gli aggiornamenti in tempo reale della time-machine
    this.timeMachineService.timeMachineObservable.subscribe(
      (updatedTimeMachine: TimeMachine | null) => { //se viene ricevuto aggiornamento: update contiene i nuovi dati (se non ci sono dati: null)
        if (updatedTimeMachine) { 
          this.today = this.convertToDateTimeLocalFormat(updatedTimeMachine.date);
          this.goToCustomDate(); 
          
        } 

        this.loadActivities();
        this.loadEvents(); 
        this.loadCalendar();
      }
    );

  }
  
  // Cambiamento data del calendario
  private goToCustomDate(): void{
    const calendarApi = this.fullcalendar.getApi();
    calendarApi.gotoDate(this.today);
    this.changeDetector.detectChanges();
  }

  /* CALENDAR */
  
  // Carica attività ed eventi nel calendario
  private loadCalendar(): void{

    // Mappa le ATTIVITA' come eventi nel formato degli eventi di FullCalendar
    const calendarActivities = this.activities.map(activity => ({
      //ogni activity di activities diventa compatibile con FullCalendar
      title: activity.title,
      start: this.isExpired(activity) ? new Date(this.today) : (activity.dueDate ? new Date(activity.dueDate) : undefined), 
        // se attività scaduta viene visualizzata oggi, altrimenti viene visualizzata nella dueDate (se esiste)
      allDay: true, 
      backgroundColor: this.isExpired(activity) ? '#d82839':'#FFBB33', 
      borderColor: '#FF8800',
      description: activity.notes 
    }));

    // Mappa gli EVENTI nel formato degli eventi di FullCalendar
    const calendarEvents = this.events.map(event => {
      const rrule: any = {};  //creazione oggetto rrule per gestire ripetizione

      if(event.recurrence != 'none'){
        rrule.freq = event.recurrence;
        rrule.dtstart = new Date(event.dateStart).toISOString();
      }

      if (event.recurrenceEnd) {
        rrule.until = new Date(event.recurrenceEnd).toISOString(); 
      }

      return{
        //ogni event di events diventa compatibile con FullCalendar
        title: event.title,
        start: event.dateStart,
        end: event.dateEnd,
        place: event.place,
        backgroundColor: '#4c95e4', 
        notes: event.notes,
        rrule: Object.keys(rrule).length ? rrule : undefined,
        allDay: this.isAllDay(event) 
      }
    });

    // Combina eventi e attività in un unico array
    const allCalendarEvents = [...calendarEvents, ...calendarActivities]; //... significa che sono di numero variabile
    // Imposta le opzioni del calendario
    this.calendarOptions.set({
      ...this.calendarOptions(), // mantiene tutte le altre options
      events: allCalendarEvents // inserisce tutti gli eventi e le attività nel calendario
    });
  }

  // Aggiornamento lista degli eventi nel calendario
  private handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); 
  }

  

  // Cambiamento vista calendario
  /*public changeView(viewName: string) {
    this.fullcalendar.getApi().changeView(viewName);
  }*/
  
  
  /* ACTIVITIES */

  // Creazione nuova attività
  public handleNewActivity(){
    
    const dialogRef = this.dialog.open(NewActivityDialogComponent, {
      width: '400vw',
      data: {}  //gli passa oggetto vuoto (nessun dato)
    });

    
    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        //creazione nuovo oggetto activity con i dati restituiti dal dialogo
        const newActivity: Activity = {
          title: result.title,
          dueDate: result.dueDate,
          notes: result.notes,
          authorUsername: this.authorUsername
        };
        this.activities.push(newActivity);

        this.activityService.createActivity(newActivity).subscribe(
          () =>  {console.log('Attività creata'), 
            this.loadActivities()
          }
            
        )
      }
    });
  }

  // Caricamento attività
  private loadActivities(): void{

    this.activityService.getActivitiesByAuthor(this.authorUsername).subscribe(
      (data) => {
        this.activities = data;
        this.loadCalendar();

        //elenco laterale
        this.activities.sort((a, b) => {  //modifica l'array originale
          if (a.dueDate && b.dueDate) { // controllo se entrambe le date sono presenti
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(); 
            //conversione in timestamp per fare il confronto:
            //se valore di ritorno positivo -> a successivo a b, 
            //se valore di ritorno negativo -> a successivo a b, 
            //se valore di ritorno = zero -> stessa data (rimangono in ordine relativo) 
            
          }
          /* controlli inutili: dueDate obbligatoria
          if (!a.dueDate) return 1; 
          if (!b.dueDate) return -1; 
          */
          return 0;
        });
      }
    );
  }
  
  // Verifica se attività scaduta
  public isExpired(activity: Activity): boolean {
  if(!activity.dueDate){
    return false;
  }
    const todayDate = new Date(this.today);
    const dueDate = new Date(activity.dueDate);
    todayDate.setHours(0, 0, 0, 0);

    return dueDate < todayDate; //True se scaduta prima di oggi 
  }

  
  // Eliminazione con checkbox
  public onCheckboxChange(activity: Activity){
    if (confirm("Vuoi eliminare " + activity.title + "?")) {  //crea finestra di conferma
      this.activityService.deleteActivity(activity.title).subscribe(
      () => {console.log(activity.title + "deleted"),
        this.loadActivities()
      }
    )
    }
  }


  
  /* EVENTS */

   // Creazione nuovo evento
  public handleNewEvent() {
   
    const dialogRef = this.dialog.open(NewEventDialogComponent, {
      width: '400vw',
      data: {}  //gli passa oggetto vuoto (nessun dato)
    });
    dialogRef.afterClosed().subscribe(result => {
      

      if (result) {

        //creazione nuovo oggetto event con i dati restituiti dal dialogo
        const newEvent: Event = {
          title: result.title,
          dateStart: result.dateStart,
          dateEnd: result.dateEnd,
          place: result.place,
          notes: result.notes,
          recurrence: result.recurrence,
          recurrenceEnd: result.recurrenceEnd,
          authorUsername: this.authorUsername
        };

        this.events.push(newEvent);

        this.eventService.createEvent(newEvent).subscribe(
          () =>  {console.log('Evento creato'), 
            this.loadEvents()}
          
        )

      }
      
    });
    
  }

  // Caricamento eventi
  private loadEvents(): void{

    this.eventService.getEventsByAuthor(this.authorUsername).subscribe(
      (data) => {

        this.events = data;
        this.loadCalendar();
        
      }
    );
  }

  // Verifica se evento "tutto il giorno"
  private isAllDay(event: Event): boolean{
    if(event.dateStart == event.dateEnd){
      return true;
    }else {
      return false;
    }
  
  }

  // Gestione del click su eventi e attività
  private handleEventClick(clickInfo: EventClickArg) {

    const clickedTitle = clickInfo.event.title;
    
    //ATTIVITA'
    // Cerca l'evento nell'array delle attività
    const clickedActivity = this.activities.find(activity => activity.title === clickedTitle);

    if (clickedActivity) {
      const dialogRef = this.dialog.open(NewActivityDialogComponent, {
        width: '400px',
        data: { // Passa i dati esistenti dell'attività
          title: clickedActivity.title,
          dueDate: clickedActivity.dueDate,
          notes: clickedActivity.notes
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Aggiorna l'attività esistente
          clickedActivity.title = result.title;
          clickedActivity.dueDate = result.dueDate;
          clickedActivity.notes = result.notes;
  
          // Salva le modifiche sul server
          this.activityService.updateActivity(clickedActivity).subscribe(
            () => {
              console.log('Attività aggiornata con successo');
              this.loadActivities(); 
              this.loadCalendar(); 
            }
          );
        }
      });

      
    } else {

      //EVENTI
      // Cerca l'evento nell'array degli eventi
      const clickedEvent = this.events.find(event => event.title === clickedTitle);
      
      if (clickedEvent) {
        const isAllDay = this.isAllDay(clickedEvent);

        // apre il dialogo per modificare l'evento
        const dialogRef = this.dialog.open(NewEventDialogComponent, {
          
          width: '400px',
          data: { // Passa i dati esistenti dell'evento
            title: clickedEvent.title,
            dateStart: clickedEvent.dateStart,
            dateEnd: clickedEvent.dateEnd,
            place: clickedEvent.place,
            notes: clickedEvent.notes,
            recurrence: clickedEvent.recurrence,
            recurrenceEnd: clickedEvent.recurrenceEnd,
            allday: isAllDay 
          }
        });
  

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Aggiorna l'evento esistente
            clickedEvent.title = result.title;
            clickedEvent.dateStart = result.dateStart;
            clickedEvent.dateEnd = result.dateEnd;
            clickedEvent.place = result.place;
            clickedEvent.notes = result.notes;
            clickedEvent.recurrence = result.recurrence;
            clickedEvent.recurrenceEnd = result.recurrenceEnd;
  
            // Salva le modifiche sul server
            this.eventService.updateEvent(clickedEvent).subscribe(
              () => {
                console.log('Evento aggiornato con successo');
                this.loadEvents();
              }
            );

            
          }else if(result == false){  //ELIMINAZIONE EVENTO
            if (confirm("Vuoi eliminare " + clickInfo.event.title + "?")) {
              clickInfo.event.remove();

              this.eventService.deleteEvent(clickInfo.event.title).subscribe(
                () => {console.log(clickInfo.event.title + "deleted"),
                  this.loadEvents()
                }
              )
            }
          }
        });

      }
    }

  }

  
  // Conversione stringa
  private convertToDateTimeLocalFormat(dateStr: string): string {
    // Formato time machine: "dd/MM/yyyy hh:mm"
    const [datePart, timePart] = dateStr.split(' '); // Divide la data e l'ora
    const [day, month, year] = datePart.split('/'); // Divide la parte della data
    const formattedDate = `${year}-${month}-${day}T${timePart}`; // Riformatta la data
    return formattedDate;
    //formato attuale ISO 8601 
  }

}
