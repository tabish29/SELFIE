import { Component, Inject } from '@angular/core';
import { UserNote } from '../../models/UserNote';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-note-dialog',
  templateUrl: './update-note-dialog.component.html',
  styleUrl: './update-note-dialog.component.css'
})
export class UpdateNoteDialogComponent {

  note: UserNote;

  constructor(
    public dialogRef: MatDialogRef<UpdateNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserNote
  ) {
    this.note = { ...data }; 
  }

  onUpdate(): void {
    this.dialogRef.close(this.note); 
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
