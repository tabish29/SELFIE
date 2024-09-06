import { Component, Inject } from '@angular/core';
import { UserNote } from '../../models/UserNote';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TimeMachineService } from '../../services/time-machine.service';

@Component({
  selector: 'app-update-note-dialog',
  templateUrl: './update-note-dialog.component.html',
  styleUrl: './update-note-dialog.component.css'
})
export class UpdateNoteDialogComponent {

  note: UserNote;

  constructor(
    public dialogRef: MatDialogRef<UpdateNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserNote,
    private timeMachineService: TimeMachineService
  ) {
    this.note = { ...data }; 
  }

  onUpdate(): void {
    if(this.note.authorUsername){

    this.timeMachineService.getTimeMachine(this.note.authorUsername).subscribe(
      (timeMachine) => {
        const now = timeMachine.date; 
        this.note.updatedAt = now; 

       
        this.dialogRef.close(this.note);
      },
      (error) => {
        console.error('Errore nel recupero della Time Machine', error);
      }
    );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
