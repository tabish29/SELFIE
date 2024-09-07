import { Component } from '@angular/core';
import { UserNote } from '../../models/UserNote';
import { UserNoteService } from '../../services/user-note.service';
import { MatDialog } from '@angular/material/dialog';
import { NewNoteDialogComponent } from '../new-note-dialog/new-note-dialog.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { UpdateNoteDialogComponent } from '../update-note-dialog/update-note-dialog.component';

@Component({
  selector: 'app-user-notes',
  templateUrl: './user-notes.component.html',
  styleUrl: './user-notes.component.css'
})
export class UserNotesComponent {
  notes: UserNote[] = [];
  selectedNote: UserNote | null = null;
  authorUsername: string = '';

  constructor(
    private dialog: MatDialog,
    private userNotesService: UserNoteService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.authorUsername = this.localStorageService.getItem('username');

    if (this.authorUsername) {
      this.loadNotesByAuthor(this.authorUsername);
    } else {
      console.log("Non esiste l'username dell'autore");
    }
  }

  loadNotes(): void {
    this.userNotesService.getNotes().subscribe(
      notes => this.notes = notes,
      error => console.error('Errore nel caricamento delle note', error)
    );
  }

  openCreateNoteDialog(): void {
    const dialogRef = this.dialog.open(NewNoteDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notes.push(result);
      }
    });
  }

  openUpdateNoteDialog(note: UserNote): void {
    const dialogRef = this.dialog.open(UpdateNoteDialogComponent, {
      width: '400px',
      data: note
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        if (result.isDeleted) {
          this.deleteNote(result.note);
        }
        if (result.isUpdated) {
          this.updateNoteInList(result.note);
        }
        
      }
    });
  }

  deleteNote(noteToDelete: UserNote): void {
    const index = this.notes.findIndex(note => note.title === noteToDelete.title);
    if (index > -1) {
      this.notes.splice(index, 1);
    }
  }

  updateNoteInList(updatedNote: UserNote): void {
    const index = this.notes.findIndex(note => note.title === updatedNote.title);
    if (index > -1) {
      this.notes[index] = updatedNote;
      this.userNotesService.updateNote(updatedNote.title, updatedNote).subscribe(
        () => console.log('Nota aggiornata con successo'),
        error => console.error('Errore nell\'aggiornamento della nota', error)
      );
    }
  }

  selectNote(note: UserNote): void {
    this.selectedNote = { ...note };
    // Open update dialog when a note is selected
    this.openUpdateNoteDialog(this.selectedNote);
  }

  loadPreviews(): void {
    this.userNotesService.getNotesPreview().subscribe(
      previews => console.log(previews),
      error => console.error('Errore nel caricamento delle anteprime', error)
    );
  }

  loadNotesByAuthor(authorUsername: string): void {
    this.userNotesService.getNotesByAuthor(authorUsername).subscribe(
      notes => this.notes = notes,
      error => console.error('Errore nel caricamento delle note dell\'autore', error)
    );
  }
}