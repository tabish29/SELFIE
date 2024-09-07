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

  

  onSave(): void {
    const inputError = document.getElementById('inputError');

    if(!this.data.title || !this.data.dueDate){
      if(inputError){
        inputError.textContent = 'Inserisci il titolo e la data di scadenza!';
      }
    } else{
      this.dialogRef.close(this.data);
    }
    
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
