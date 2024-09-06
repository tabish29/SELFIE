import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeMachineService } from '../../services/time-machine.service';
import { LocalStorageService } from '../../services/local-storage.service';
//import { TimeMachine } from '../../models/TimeMachine';
//import { CalendarComponent } from '../calendar/calendar.component';
import { Activity } from '../../models/Activity';
import { ActivityService } from '../../services/activity.service';



@Component({
  selector: 'app-new-activity-dialog',
  templateUrl: './new-activity-dialog.component.html',
  styleUrl: './new-activity-dialog.component.css'
})
export class NewActivityDialogComponent {
  title: string = '';
  dueDate: null = null;
  notes: string = '';
  authorUsername: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<NewActivityDialogComponent>,
    private activityService: ActivityService,
    //private timeMachineService: TimeMachineService,
    private localStorageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  
  ngOnInit(): void {
    this.authorUsername = this.localStorageService.getItem('username');
  }

  onCreate(): void {
    
    if (!this.authorUsername) {
      console.error('Username is missing');
      return;
    }

    //this.timeMachineService.getTimeMachine(this.authorUsername).subscribe(
      //(timeMachine: TimeMachine) => {
        //const now = timeMachine.date;

        const newActivity : Activity= {
          title: this.title,
          dueDate: this.dueDate,
          notes: this.notes,
          authorUsername: this.authorUsername
        };

        this.activityService.createActivity(newActivity).subscribe(
          activity => {
            this.dialogRef.close(activity);
          },
          error => console.error('Errore nella creazione della nota', error)
        );
      
      //},
      //error => console.error('Errore nel recupero del time machine', error)
    //);
  }

  onSave(): void {
    const inputError = document.getElementById('inputError');

    if(!this.data.title || !this.data.dueDate){
      if(inputError){
        inputError.textContent = 'Title and Due Date are required';
      }
    } else{
      this.dialogRef.close(this.data);
    }
    
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
