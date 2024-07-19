import { Component } from '@angular/core';
import { UserNote } from '../../models/UserNote';
import { UserNoteService } from '../../services/user-note.service';
import { TimeMachineService } from '../../services/time-machine.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { TimeMachine } from '../../models/TimeMachine';

@Component({
  selector: 'app-user-notes',
  templateUrl: './user-notes.component.html',
  styleUrl: './user-notes.component.css'
})
export class UserNotesComponent {
  notes: UserNote[] = [];
  selectedNote: UserNote | null = null;
  username: string | null = null;
  newNote: UserNote = new UserNote('', '', [], '', '', '');

  constructor(
    private localStorageService: LocalStorageService,
    private userNotesService: UserNoteService,
    private timeMachineService: TimeMachineService
  ) {}

  ngOnInit(): void {
    this.username = this.localStorageService.getItem('username');
    this.loadNotes();
  }

  loadNotes(): void {
    if (this.username) {
      this.userNotesService.getNotes().subscribe(
        notes => this.notes = notes,
        error => console.error('Errore nel caricamento delle note', error)
      );
    }
  }

  selectNote(note: UserNote): void {
    this.selectedNote = { ...note };
  }

  createNote(newNote: UserNote): void {
    if (this.username) {
      this.timeMachineService.getTimeMachine(this.username).subscribe(
        (timeMachine: TimeMachine) => {
          const now = timeMachine.date;
          newNote.createdAt = now;
          newNote.updatedAt = now;
          newNote.authorUsername = this.username; 
          this.userNotesService.createNote(newNote).subscribe(
            note => {
              this.notes.push(note);
              newNote = new UserNote('', '', [], now, now, this.username);
            },
            error => console.error('Errore nella creazione della nota', error)
          );
        },
        error => console.error('Errore nel recupero del time machine', error)
      );
    }
  }

  updateNote(selectedNote: UserNote): void {
    if (this.username && selectedNote != null) {
      this.timeMachineService.getTimeMachine(this.username).subscribe(
        (timeMachine: TimeMachine) => {
          selectedNote.updatedAt = timeMachine.date;
          this.userNotesService.updateNote(selectedNote.title, selectedNote).subscribe(
            updatedNote => {
              const index = this.notes.findIndex(note => note.title === updatedNote.title);
              if (index > -1) {
                this.notes[index] = updatedNote;
              }
              this.selectedNote = null;
            },
            error => console.error('Errore nell\'aggiornamento della nota', error)
          );
        },
        error => console.error('Errore nel recupero del time machine', error)
      );
    }
  }

  deleteNote(title: string): void {
    this.userNotesService.deleteNote(title).subscribe(
      () => {
        this.notes = this.notes.filter(note => note.title !== title);
      },
      error => console.error('Errore nella cancellazione della nota', error)
    );
  }

  loadPreviews(): void {
    this.userNotesService.getNotesPreview().subscribe(
      previews => console.log(previews),
      error => console.error('Errore nel caricamento delle anteprime', error)
    );
  }

  loadNotesByAuthor(authorUsername: string): void {
    this.userNotesService.getNotesByAuthor(authorUsername).subscribe(
      notes => console.log(notes),
      error => console.error('Errore nel caricamento delle note dell\'autore', error)
    );
  }
}
