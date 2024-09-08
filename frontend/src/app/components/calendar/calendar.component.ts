import { Component , signal, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular'; 
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';  
import listPlugin from '@fullcalendar/list';          
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { MatDialog } from '@angular/material/dialog';
import { NewActivityDialogComponent } from '../new-activity-dialog/new-activity-dialog.component';
import { Activity } from '../../models/Activity';
import { ActivityService } from '../../services/activity.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { TimeMachineService } from '../../services/time-machine.service';
import { TimeMachine } from '../../models/TimeMachine';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})

export class CalendarComponent {
  constructor(
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private activityService: ActivityService,
    private localStorageService: LocalStorageService,
    private timeMachineService: TimeMachineService
  ) {}


  activities: Activity[] = [];
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
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
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
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });

  
  @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;

  /* CALENDAR */

  
  ngOnInit(): void {
    
    this.authorUsername = this.localStorageService.getItem('username') || '';
    if (!this.authorUsername) {
      console.error('Username is missing');
    }

    this.timeMachineService.getTimeMachine(this.authorUsername).subscribe(
      (timeMachine: TimeMachine) => {
        
        this.today = this.convertToDateTimeLocalFormat(timeMachine.date);
        console.log("Calendar date of today: " + this.today);
        this.updateCalendarDate();
      },
      (error) => console.error('Errore nel recupero del time machine', error)
    );


    this.loadActivities();
    
  }
  
  // NON FUNZIONA
  updateCalendarDate(): void {
    if (this.fullcalendar && this.today) {
      const calendarApi = this.fullcalendar.getApi();
      calendarApi.gotoDate(this.convertToDateTimeLocalFormat(this.today)); 
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
        
        

        //VISUALIZZAZIONE NEL CALENDARIO DELLE ATTIVITA
        

      }
      
    );

  }

  

  
  isExpired(activity: Activity): boolean {
  if(!activity.dueDate){
    return false;
  }
    const todayDate = new Date(this.today);
    const dueDate = new Date(activity.dueDate);

    console.log("Oggi: " + todayDate + "Data di scadenza:" + todayDate);

    return dueDate < todayDate; //True se scaduta prima di oggi 
    return true;
  }
    
  onCheckboxChange(activity: Activity){
    console.log(activity.title + " checked")
    this.activityService.deleteActivity(activity.title).subscribe(
      () => console.log(activity.title + "deleted")
    )
    this.loadActivities();
  }
  

  handleDateSelect(selectInfo: DateSelectArg) {
    console.log('Date selected:', selectInfo);
    /*
    const dialogRef = this.dialog.open(NewEventDialogComponent, {
      width: '400px',
      data: {
        startStr: selectInfo.startStr,
        endStr: selectInfo.endStr,
        allDay: selectInfo.allDay
      }
    });

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
    });*/


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
          () => console.log('Attività creata' + newActivity),
          error => console.error("Errore nella creazione dell'attività")
        )

        
      }
      
    });

    this.loadActivities();
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
