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
  //luogo
  notes: string = '';
  //ripetizione
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

    if(!this.data.title || !this.data.dateStart || !this.data.dateEnd || !this.data.dateEnd){
      if(inputError){
        inputError.textContent = 'Inserisci il titolo e la data!';
      }
    } else{
      this.dialogRef.close(this.data);
    }
    
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
