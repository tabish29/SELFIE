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
  place: string = '';
  notes: string = '';
  recurrence: string = '';
  recurrenceEnd: null = null;
  authorUsername: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<NewEventDialogComponent>,
    private eventService: EventService,
    private localStorageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
  }

  ngOnInit(): void {

    this.authorUsername = this.localStorageService.getItem('username');
   
  }

  onSave(): void {
    const inputError = document.getElementById('inputError');
    
    console.log(this.data);

    //controllo sui campi obbligatori
    if(!this.data.title || !this.data.dateStart || (!this.data.dateEnd && !this.allDay) || !this.data.recurrence){
      if(inputError){
        inputError.textContent = 'Titolo, data e ripetizione sono obbligatori!';
      }
     //controllo date 
    }else if(this.data.dateStart > this.data.dateEnd) {
      if(inputError){
        inputError.textContent = 'Non può finire prima di iniziare!';
      }
    } else {
      if (this.allDay) {
        this.data.dateEnd = this.data.dateEnd || this.data.dateStart;
      }
      
      this.dialogRef.close(this.data);
    }

   
    
  }

  public allDayChange(): void{

    this.allDay = !this.allDay;
    /*if(this.allDay){
      this.allDay = false;
    }else {
      this.allDay = true;
    }*/

    
  }


  onCancel(): void {
    this.dialogRef.close();
  }

}
