import { Component , signal, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular'; 
//import { FullCalendarModule } from '@fullcalendar/angular'; 
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

import { CalendarOptions, EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';  
import listPlugin from '@fullcalendar/list';        
import interactionPlugin from '@fullcalendar/interaction';  
import rrulePlugin from '@fullcalendar/rrule';



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
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      interactionPlugin,
      rrulePlugin 
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
    weekends: true,
    editable: true,
    selectable: false,
    selectMirror: true,
    dayMaxEvents: true,
    timeZone: 'local',
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    
  });

  
  public onMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    this.dragService.startDrag(event, target);
  }
  
  private handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); 
  }
  

  /* CALENDAR */
  public ngOnInit(): void {
    
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

  private loadCalendar(): void{
    // Mappa le attività come eventi nel formato degli eventi di FullCalendar
    const activityEvents = this.activities.map(activity => ({
      
      title: activity.title,
      start: this.isExpired(activity) ? new Date(this.today) : (activity.dueDate ? new Date(activity.dueDate) : undefined), // scadenza come data di inizio
      allDay: true, 
      backgroundColor: this.isExpired(activity) ? '#d82839':'#FFBB33', 
      borderColor: '#FF8800',
      description: activity.notes 
    }));

    // Mappa gli eventi nel degli eventi di FullCalendar
    const calendarEvents = this.events.map(event => {
      const rrule: any = {};

      if(event.recurrence != 'none'){
        rrule.freq = event.recurrence;
        rrule.dtstart = new Date(event.dateStart).toISOString();
        
      }

      if (event.recurrenceEnd) {
        rrule.until = new Date(event.recurrenceEnd).toISOString(); 
      }

      return{
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
    const allCalendarEvents = [...calendarEvents, ...activityEvents];
    // Imposta le opzioni del calendario
    this.calendarOptions.set({
      ...this.calendarOptions(), // mantiene le altre opzioni
      events: allCalendarEvents // inserisce tutti gli eventi e le attività
    });
  }

  private goToCustomDate(): void{
    const calendarApi = this.fullcalendar.getApi();
    calendarApi.gotoDate(this.today);
    this.changeDetector.detectChanges();
  }


  /*
  handleTodayButtonClick() {
    const calendarApi = this.fullcalendar.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(this.today);
      
    }
  }*/


  public changeView(viewName: string) {
    this.fullcalendar.getApi().changeView(viewName);
  }
  
  
  /* ACTIVITIES */

  public handleNewActivity(){
    
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

  //carica le attività
  loadActivities(){

    this.activityService.getActivitiesByAuthor(this.authorUsername).subscribe(
      (data) => {
        this.activities = data;

        /*
        for(var i = 0; i<this.activities.length; i++){
          this.isExpired(this.activities[i]);
          
        }*/

        //elenco laterale
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
  
  public isExpired(activity: Activity): boolean {
  if(!activity.dueDate){
    return false;
  }
    const todayDate = new Date(this.today);
    const dueDate = new Date(activity.dueDate);
    todayDate.setHours(0, 0, 0, 0);

    return dueDate < todayDate; //True se scaduta prima di oggi 
  }

  
  //eliminazione con checkbox
  public onCheckboxChange(activity: Activity){
    if (confirm("Vuoi eliminare " + activity.title + "?")) {
      this.activityService.deleteActivity(activity.title).subscribe(
      () => {console.log(activity.title + "deleted"),
        this.loadActivities()
      }
    )
    }
  }


  
  /* EVENTS */

  public handleNewEvent() {
   
    const dialogRef = this.dialog.open(NewEventDialogComponent, {
      width: '400px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      

      if (result) {

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

  private loadEvents(){

    
    this.eventService.getEventsByAuthor(this.authorUsername).subscribe(
      (data) => {
        this.events = data;

        /*
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
        });*/
        
        this.loadCalendar();
        
      }
      
    );

    
  }

  /*
  pastEvent(event: Event){
    if(!event.dateEnd){
      return false;
    }
    const todayDate = new Date(this.today);
    const dateEnd = new Date(event.dateEnd);

    return dateEnd < todayDate; //True se scaduta prima di oggi 
  }*/

  private isAllDay(event: Event): boolean{
    if(event.dateStart == event.dateEnd){
      return true;
    }else {
      return false;
    }
  
  }

  private handleEventClick(clickInfo: EventClickArg) {

    const clickedTitle = clickInfo.event.title;
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
              this.loadActivities(); // Ricarica le attività
              this.loadCalendar(); // Aggiorna il calendario
            }
          );
        }
      });
    } else {
      // Cerca l'evento corrispondente all'interno dell'array `events`
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
                this.loadEvents(); // Ricarica gli eventi
                this.loadCalendar(); // Aggiorna il calendario
              }
            );
          }
        });
      }
    }
  

    
    /*
    const dialogRef = this.dialog.open(UpdateEventComponent, {
      width: '400px',
      data: {}
    });*/
    
      

    //DELETE EVENT
    /*if (confirm("Vuoi eliminare " + clickInfo.event.title + "?")) {
      clickInfo.event.remove();

      this.eventService.deleteEvent(clickInfo.event.title).subscribe(
        () => {console.log(clickInfo.event.title + "deleted"),
          this.loadEvents()
        }
      )
    }*/
  
  }

  private convertToDateTimeLocalFormat(dateStr: string): string {
    // Formato time machine: "dd/MM/yyyy hh:mm"
    const [datePart, timePart] = dateStr.split(' '); // Divide la data e l'ora
    const [day, month, year] = datePart.split('/'); // Divide la parte della data
    const formattedDate = `${year}-${month}-${day}T${timePart}`; // Riformatta la data
    return formattedDate;
    //formato attuale ISO 8601 
  }

}
