import { Component , signal, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
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

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  activities: Activity[] = [];
  authorUsername: string = '';

  constructor(
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private activityService: ActivityService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.authorUsername = this.localStorageService.getItem('username') || '';
    if (!this.authorUsername) {
      console.error('Errore: Nessun username trovato');
    }
  }
  
  @ViewChild('fullcalendar')
  fullcalendar!: FullCalendarComponent;
  
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

  changeView(viewName: string) {
    this.fullcalendar.getApi().changeView(viewName);
  }
  
  currentEvents = signal<EventApi[]>([]);

 

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
          dueDate: result.dueDate ? new Date(result.dueDate) : null,
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

  }

}
