import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '../../services/local-storage.service';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-new-event-dialog',
  templateUrl: './new-event-dialog.component.html',
  styleUrl: './new-event-dialog.component.css'
})
export class NewEventDialogComponent {
  title: string = '';
  dateStart: null = null;
  dateEnd: null = null;
  allDay: boolean = false;
  //luogo
  notes: string = '';
  recurrence: string = '';
  //fine ripetizione
  authorUsername: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<NewEventDialogComponent>,
    private eventService: EventService,
    private localStorageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.authorUsername = this.localStorageService.getItem('username');
  }

  onSave(): void {
    const inputError = document.getElementById('inputError');
    console.log(this.data);
    if(!this.data.title || !this.data.dateStart || (!this.data.dateEnd && !this.allDay) || !this.data.recurrence){
      if(inputError){
        inputError.textContent = 'Inserisci titolo, data e ripetizione!';
      }
    } else{
      if(this.allDay){
        this.dialogRef.close(this.data);
      }else{
        this.data.dateEnd = this.data.dateStart;
        this.dialogRef.close(this.data);
      }
      this.data.dateEnd = this.data.dateStart;
      this.dialogRef.close(this.data);
    }
    
  }

  allDayChange(): void{
    
    if(this.allDay){
      console.log("unchecked");
      this.allDay = false;
      
      
    }else {
      this.allDay = true;
      
    }
    
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
