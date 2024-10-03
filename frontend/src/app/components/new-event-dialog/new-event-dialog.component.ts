import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-new-event-dialog',
  templateUrl: './new-event-dialog.component.html',
  styleUrl: './new-event-dialog.component.css'
})
export class NewEventDialogComponent {
  //proprietà della classe
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
    public dialogRef: MatDialogRef<NewEventDialogComponent>,  //riferimento al dialogo 
    private localStorageService: LocalStorageService, //
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // imposta i valori iniziali in base ai dati passati
    this.title = data.title || '';           
    this.dateStart = data.dateStart || null; 
    this.dateEnd = data.dateEnd || null;     
    this.allDay = data.allday || false;      
    this.place = data.place || '';
    this.notes = data.notes || '';
    this.recurrence = data.recurrence || '';
    this.recurrenceEnd = data.recurrenceEnd || null;
  }

  ngOnInit(): void {

    this.authorUsername = this.localStorageService.getItem('username');
   
  }

  onSave(): void {
    const inputError = document.getElementById('inputError');

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
        //this.data.dateEnd = this.data.dateEnd || this.data.dateStart;
        this.data.dateEnd = this.data.dateStart;
      }
      
      this.dialogRef.close(this.data);
    }

   
    
  }

  public allDayChange(): void{

    this.allDay = !this.allDay;
    
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void{
    this.dialogRef.close(false);
  }

}
