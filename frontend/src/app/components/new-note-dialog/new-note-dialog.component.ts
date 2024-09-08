import { Component, Inject } from '@angular/core';
import { UserNote } from '../../models/UserNote';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserNoteService } from '../../services/user-note.service';
import { TimeMachineService } from '../../services/time-machine.service';
import { TimeMachine } from '../../models/TimeMachine';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-new-note-dialog',
  templateUrl: './new-note-dialog.component.html',
  styleUrl: './new-note-dialog.component.css'
})
export class NewNoteDialogComponent {
  title: string = '';
  content: string = '';
  categories: string[] = [];
  categoryInput: string = '';
  authorUsername: string | null = null;
  selectedColor: string = '';
  colors: { name: string, value: string }[] = [
    { name: 'rosso', value: 'red' },
    { name: 'giallo', value: 'yellow' },
    { name: 'verde', value: 'green' },
    { name: 'blu', value: 'blue' },
    { name: 'viola', value: 'purple' },
    { name: 'arancione', value: 'orange' },
    { name: 'marrone', value: 'brown' },
    { name: 'grigio', value: 'gray' },
    { name: 'bianco', value: 'white' }
  ];

  constructor(
    public dialogRef: MatDialogRef<NewNoteDialogComponent>,
    private userNoteService: UserNoteService,
    private timeMachineService: TimeMachineService,
    private localStorageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.authorUsername = this.localStorageService.getItem('username');
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  addCategory(): void {
    if (this.categoryInput.trim() && !this.categories.includes(this.categoryInput.trim())) {
      this.categories.push(this.categoryInput.trim());
      this.categoryInput = '';
    }
  }

  removeCategory(index: number): void {
    this.categories.splice(index, 1);
  }

  onCreate(): void {
    if (!this.authorUsername) {
      console.error('Username is required');
      return;
    }

    this.timeMachineService.getTimeMachine(this.authorUsername).subscribe(
      (timeMachine: TimeMachine) => {
        const now = timeMachine.date;
        const newNote: UserNote = {
          title: this.title,
          content: this.content,
          categories: this.categories,
          createdAt: now,
          updatedAt: now,
          authorUsername: this.authorUsername,
          noteColor: this.selectedColor
        };

        this.userNoteService.createNote(newNote).subscribe(
          note => {
            this.dialogRef.close(newNote);
          },
          error => console.error('Errore nella creazione della nota', error)
        );
      },
      error => console.error('Errore nel recupero del time machine', error)
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}