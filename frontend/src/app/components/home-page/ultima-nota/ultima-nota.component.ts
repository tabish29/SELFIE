import { Component,Input, OnInit } from '@angular/core';
import { TimeMachineService } from '../../../services/time-machine.service'; // Importa il servizio
import { TimeMachine } from '../../../models/TimeMachine';
import { UserNote } from '../../../models/UserNote';
import { UserNoteService } from '../../../services/user-note.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { UpdateNoteDialogComponent } from '../../update-note-dialog/update-note-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ultima-nota',
  templateUrl: './ultima-nota.component.html',
  styleUrl: './ultima-nota.component.css'
})
export class UltimaNotaComponent {
  @Input() visualMode: number = 0; // Modalità di visualizzazione corrente
  notes: UserNote[] = [];
  selectedNote: UserNote | null = null;
  authorUsername: string = '';
  today: string = '';
  noteDay: UserNote[] = []; // Nuovo array per le note del giorno

  constructor(
    private userNotesService: UserNoteService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private timeMachineService: TimeMachineService
  ) { }

  ngOnInit(): void {
    this.authorUsername = this.localStorageService.getItem('username');
    //console.log("note: ",this.authorUsername);
    const savedVisualMode = this.localStorageService.getItem('noteVisualMode');
    if (savedVisualMode !== null) {
      this.visualMode = Number(savedVisualMode);
    }
    
    if (this.authorUsername) {
      this.loadTimeMachineDate();
    } else {
      console.log("Non esiste l'username dell'autore");
    }
  }
  // Metodo per cambiare il visualMode e salvarlo nel localStorage
  changeVisualMode(newMode: number): void {
    this.visualMode = newMode;
    this.localStorageService.setItem('noteVisualMode', String(this.visualMode));
  }
  
  loadTimeMachineDate(): void {
    this.timeMachineService.getTimeMachine(this.authorUsername).subscribe(
      (timeMachine: TimeMachine) => {
        this.today = timeMachine.date.slice(0, 10); // Converte la stringa in formato YYYY-MM-DD
        
        console.log("Data Time Machine:", this.today);
        this.loadNotesByAuthor(this.authorUsername); // Carica le note dopo aver ottenuto la data
      },
      error => {
        console.error('Errore durante il recupero della time machine:', error);
      }
    );

    // Sottoscrizione per ascoltare gli aggiornamenti in tempo reale
    this.timeMachineService.timeMachineObservable.subscribe(
      (updatedTimeMachine: TimeMachine | null) => {
        if (updatedTimeMachine) {
          this.today = updatedTimeMachine.date.slice(0, 10); // Converte la stringa in formato YYYY-MM-DD
          
          this.loadNotesForToday(); // Aggiorna le note per il giorno corrente
          console.log('TimeMachine aggiornata: ', updatedTimeMachine.date);
        } else {
          console.error('Nessuna TimeMachine disponibile');
        }
      }
    );
  }

  // Metodo per caricare le note dell'autore
  loadNotesByAuthor(authorUsername: string): void {
    this.userNotesService.getNotesByAuthor(authorUsername).subscribe(
      notes => {
        this.notes = notes;
        this.selectLatestNote();  // Metodo per selezionare l'ultima nota
        this.loadNotesForToday(); // Carica le note del giorno
      },
      error => console.error('Errore nel caricamento delle note dell\'autore', error)
    );
  }

  // Metodo per selezionare l'ultima nota aggiornata
  selectLatestNote(): void {
    if (this.notes.length > 0) {
      this.notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      this.selectedNote = this.notes[0]; // Seleziona l'ultima nota aggiornata
    }
    //console.log('Note:', this.notes);
  }

  // Metodo per caricare solo le note del giorno
  loadNotesForToday(): void {
    // Esegui la chiamata al servizio passando lo username
    this.timeMachineService.getTimeMachine(this.authorUsername).subscribe(
      (timeMachine: TimeMachine) => {
        const today = timeMachine.date.slice(0,10); // Converte la stringa in un oggetto Date
        
        this.noteDay = this.notes.filter(note => {
          const noteDate = (note.updatedAt || note.createdAt).slice(0,10);
          //console.log(noteDate, today);
          // Verifica se la nota è stata creata o aggiornata oggi
          return noteDate === today;
        });
        
        //console.log('Note del giorno:', this.noteDay);
      },
      error => {
        console.error('Errore durante il recupero della time machine:', error);
      }
    );
  }

 
  /*Metodo per modificare le Note */
  selectNote(note: UserNote): void {
    this.selectedNote = { ...note };

    this.openUpdateNoteDialog(this.selectedNote);
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
        if (result.isDuplicated) {
          this.duplicateNoteInList(result.note);
        }

      }
    });
  }
  duplicateNoteInList(duplicatedNote: UserNote): void {
    if (duplicatedNote.authorUsername) {
      this.userNotesService.createNote(duplicatedNote).subscribe(
        (createdNote) => {
          console.log('Nota duplicata con successo');
          this.notes.push(duplicatedNote);
        },
        (error) => console.error('Errore nella duplicazione della nota', error)
      );

    }
  }
  updateNoteInList(updatedNote: UserNote): void {
    const index = this.notes.findIndex(note => note.title === updatedNote.title);
    if (index > -1) {
      this.notes[index] = updatedNote;
  
      if (updatedNote.authorUsername) {
        this.userNotesService.updateNote(updatedNote.authorUsername, updatedNote.title, updatedNote).subscribe(
          () => console.log('Nota aggiornata con successo'),
          error => console.error('Errore nell\'aggiornamento della nota', error)
        );
      }
    }
  }
  deleteNote(noteToDelete: UserNote): void {
    const index = this.notes.findIndex(note => note.title === noteToDelete.title);
    if (index > -1) {
      this.notes.splice(index, 1);
    }
  } 
  // Modalità di visualizzazione differenti
  get currentView() {
    switch (this.visualMode) {
      case 0:
        return 'Visualizzazione 1';
      case 1:
        return 'Visualizzazione 2';
      case 2:
        return 'Visualizzazione 3';
      default:
        return 'Visualizzazione Predefinita';
    }
  }
}
