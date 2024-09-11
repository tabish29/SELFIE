import { Component , signal, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular'; 
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';  
import listPlugin from '@fullcalendar/list';        
import interactionPlugin from '@fullcalendar/interaction';  
import { INITIAL_EVENTS, createEventId } from './event-utils';
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
    private http: HttpClient
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
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
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
    console.log(activity.title + " checked")
    this.activityService.deleteActivity(activity.title).subscribe(
      () => {console.log(activity.title + "deleted"),
        this.loadActivities()
      }
    )
    
  }


  
  /* EVENTS */

  handleDateSelect(selectInfo: DateSelectArg) {
    console.log('Date selected:', selectInfo);
    
    
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
    
    
/*
    dialogRef.afterClosed().subscribe(result => {
      const calendarApi = selectInfo.view.calendar;
      calendarApi.unselect(); // clear date selection

      if (result) {
        calendarApi.addEvent({
          id: createEventId(),
          title: result.title,
          start: result.start,
          end: result.end,
          allDay: result.allDay
        });
      }
    });
    */

    /*
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }*/
  }

  loadEvents(){

    
    this.eventService.getEventsByAuthor(this.authorUsername).subscribe(
      (data) => {
        this.events = data;

        for(var i=0; i<this.events.length; i++){
          if(this.pastEvent(this.events[i])){
            //SEGNA EVENTO PASSATO -> NON CARICARE GLI EVENTI PASSATI
          }
        }
        
        

        //ELENCO LATERALE DELLE ATTIVITA
        this.events.sort((a, b) => {
          if (a.dateStart && b.dateStart) {
            return new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime();
          }
          // Se una delle due date è null, la consideriamo come "più lontana"
          if (!a.dateStart) return 1; // Metti null alla fine
          if (!b.dateStart) return -1; // Metti null alla fine
          return 0; // Se entrambe sono null, lasciale inalterate
        });
        
        

        this.calendarOptions.set({
          ...this.calendarOptions(),  // Mantiene le altre opzioni
          events: this.events.map(event => ({
            title: event.title,
            start: event.dateStart,
            end: event.dateEnd,
            notes: event.notes,
            allDay: false  // Imposta allDay a false se non lo è, oppure gestiscilo in base ai dati
          }))
        });

        console.log(this.events);
        
      }
      
    );
/*
    this.http.get<any[]>('http://localhost:3000/events').subscribe(events => {
      // Imposta le opzioni del calendario con gli eventi
      this.calendarOptions.set( {
        initialView: 'dayGridMonth',
        events: events, // Gli eventi dal server
        editable: true,
        selectable: true,
        // Altre opzioni
      });
    });*/
    
    
  }

  pastEvent(event: Event){
    if(!event.dateEnd){
      return false;
    }
      const todayDate = new Date(this.today);
      const dateEnd = new Date(event.dateEnd);
  
      console.log(event.title + " " + (dateEnd < todayDate));
      return dateEnd < todayDate; //True se scaduta prima di oggi 
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); 
  }

  hadleNewActivity(){
    
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
            this.loadActivities()}
          
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
