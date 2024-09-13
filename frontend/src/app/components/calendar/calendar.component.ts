import { Component , signal, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular'; 
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';  
import listPlugin from '@fullcalendar/list';        
import interactionPlugin from '@fullcalendar/interaction';  
//import { INITIAL_EVENTS, createEventId } from './event-utils';
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
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})

export class CalendarComponent {
  @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;
  
  constructor(
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private activityService: ActivityService,
    private eventService: EventService,
    private localStorageService: LocalStorageService,
    private timeMachineService: TimeMachineService,
    //private http: HttpClient
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
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      interactionPlugin
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
    initialDate: new Date(),
    //initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: false,
    selectMirror: true,
    dayMaxEvents: true,
    //select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    
    
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });

  
  
  

  /* CALENDAR */
  ngOnInit(): void {
    
    this.authorUsername = this.localStorageService.getItem('username') || '';
    if (!this.authorUsername) {
      console.error('Username is missing');
    }

    this.timeMachineService.getTimeMachine(this.authorUsername).subscribe(
      (timeMachine: TimeMachine) => {
        
        this.today = this.convertToDateTimeLocalFormat(timeMachine.date);
        
        this.goToCustomDate();

      },
      (error) => console.error('Errore nel recupero del time machine', error)
    );

   
    
    this.loadActivities();
    this.loadEvents();
    
  }

  loadCalendar(): void{
    // Mappa le attività nel formato degli eventi di FullCalendar
    const activityEvents = this.activities.map(activity => ({
      title: activity.title,
      start: activity.dueDate ? new Date(activity.dueDate) : undefined, // Utilizza la data di scadenza come data di inizio
      allDay: true, // Imposta come all-day se non c'è un'ora specifica
      backgroundColor: '#FFBB33', // Cambia colore per distinguere le attività dagli eventi
      borderColor: '#FF8800',
      description: activity.notes // Puoi usare description per le note o altre informazioni
    }));

    // Mappa gli eventi nel formato corretto
    const calendarEvents = this.events.map(event => ({
      title: event.title,
      start: event.dateStart,
      end: event.dateEnd,
      notes: event.notes,
      allDay: this.isAllDay(event) // Se l'evento è tutto il giorno
    }));

    // Combina eventi e attività
    const allCalendarEvents = [...calendarEvents, ...activityEvents];

    // Imposta le opzioni del calendario
    this.calendarOptions.set({
      ...this.calendarOptions(), // Mantieni le altre opzioni
      events: allCalendarEvents // Inserisci tutti gli eventi e le attività
    });
  }

  goToCustomDate(): void{
    const calendarApi = this.fullcalendar.getApi();
    calendarApi.gotoDate(this.today);
  }


  handleTodayButtonClick() {
    const calendarApi = this.fullcalendar.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(this.today);
      this.changeDetector.detectChanges();
    }
  }


  changeView(viewName: string) {
    this.fullcalendar.getApi().changeView(viewName);
  }
  
  
  /* ACTIVITIES */
  //carica le attività dell'utente
  loadActivities(){

    this.activityService.getActivitiesByAuthor(this.authorUsername).subscribe(
      (data) => {
        this.activities = data;

        for(var i = 0; i<this.activities.length; i++){
          this.isExpired(this.activities[i]);
          
        }

        //ELENCO LATERALE DELLE ATTIVITA
        this.activities.sort((a, b) => {
          if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
          // Se una delle due date è null, la consideriamo come "più lontana"
          if (!a.dueDate) return 1; // Metti null alla fine
          if (!b.dueDate) return -1; // Metti null alla fine
          return 0; // Se entrambe sono null, lasciale inalterate
        });

        
        
      }
      
      
    );
    
  }
  
  isExpired(activity: Activity): boolean {
  if(!activity.dueDate){
    return false;
  }
    const todayDate = new Date(this.today);
    const dueDate = new Date(activity.dueDate);
    todayDate.setHours(0, 0, 0, 0);

    return dueDate < todayDate; //True se scaduta prima di oggi 
  }

  
    
  onCheckboxChange(activity: Activity){
    if (confirm("Vuoi eliminare " + activity.title + "?")) {
      this.activityService.deleteActivity(activity.title).subscribe(
      () => {console.log(activity.title + "deleted"),
        this.loadActivities()
      }
    )
    }
    
  }


  
  /* EVENTS */

  //handleDateSelect(selectInfo: DateSelectArg) {}
  handleNewEvent() {
    //console.log('Date selected:', selectInfo);
    
    
    const dialogRef = this.dialog.open(NewEventDialogComponent, {
      width: '400px',
      data: {
        /*startStr: selectInfo.startStr,
        endStr: selectInfo.endStr,
        allDay: selectInfo.allDay*/
      }

      
      
    });
    dialogRef.afterClosed().subscribe(result => {
      

      if (result) {

        const newEvent: Event = {
          title: result.title,
          dateStart: result.dateStart,
          dateEnd: result.dateEnd,
          notes: result.notes,
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

  loadEvents(){

    
    this.eventService.getEventsByAuthor(this.authorUsername).subscribe(
      (data) => {
        this.events = data;

        for(var i=0; i<this.events.length; i++){
          if(!this.pastEvent(this.events[i])){
            //SEGNA EVENTO PASSATO -> NON CARICARE GLI EVENTI PASSATI
          }
        }
        
        

        //ELENCO LATERALE DELLE EVENTI
        this.events.sort((a, b) => {
          if (a.dateStart && b.dateStart) {
            return new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime();
          }
          // Se una delle due date è null, la consideriamo come "più lontana"
          if (!a.dateStart) return 1; // Metti null alla fine
          if (!b.dateStart) return -1; // Metti null alla fine
          return 0; // Se entrambe sono null, lasciale inalterate
        });
        
        this.loadCalendar();
      

        console.log(this.events);
        console.log(this.activities);
        
      }
      
    );

    
  }

  pastEvent(event: Event){
    if(!event.dateEnd){
      return false;
    }
    const todayDate = new Date(this.today);
    const dateEnd = new Date(event.dateEnd);

    return dateEnd < todayDate; //True se scaduta prima di oggi 
  }

  isAllDay(event: Event): boolean{
    if(event.dateStart == event.dateEnd){
      return true;
    }else {
      return false;
    }
  
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm("Vuoi eliminare " + clickInfo.event.title + "?")) {
      clickInfo.event.remove();

      //se evento -> elimina evento
      //se attività -> elimina attività
      this.eventService.deleteEvent(clickInfo.event.title).subscribe(
        () => {console.log(clickInfo.event.title + "deleted"),
          this.loadEvents()
        }
      )
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); 
  }

  handleNewActivity(){
    
    const dialogRef = this.dialog.open(NewActivityDialogComponent, {
      width: '400px',
      data: {}
    });

    
    dialogRef.afterClosed().subscribe(result => {
      

      if (result) {

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
            this.loadCalendar();
          }
            
        )
        
        
      }
      
    });
    
  }

  convertToDateTimeLocalFormat(dateStr: string): string {
    // Formato time machine: "dd/MM/yyyy hh:mm"
    const [datePart, timePart] = dateStr.split(' '); // Divide la data e l'ora
    const [day, month, year] = datePart.split('/'); // Divide la parte della data
    const formattedDate = `${year}-${month}-${day}T${timePart}`; // Riformatta la data
    return formattedDate;
    //formato attuale ISO 8601 
  }

}
