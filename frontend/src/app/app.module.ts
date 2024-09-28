import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select'; 
import { MatOptionModule } from '@angular/material/core';  


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PomodoroTimerComponent } from './components/pomodoro-timer/pomodoro-timer.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { TimeMachineComponent } from './components/time-machine/time-machine.component';
import { UserNotesComponent } from './components/user-notes/user-notes.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NewNoteDialogComponent } from './components/new-note-dialog/new-note-dialog.component';
import { NewActivityDialogComponent } from './components/new-activity-dialog/new-activity-dialog.component';
import { UpdateNoteDialogComponent } from './components/update-note-dialog/update-note-dialog.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { GameComponent } from './components/game/game.component';
import { TrisComponent } from './components/game/tris/tris.component';
import { SnakeComponent } from './components/game/snake/snake.component';
import { ImpiccatoComponent } from './components/game/impiccato/impiccato.component';
import { PuzzleComponent } from './components/game/puzzle/puzzle.component';
import { EventiPreviewComponent } from './components/home-page/eventi-preview/eventi-preview.component';
import { UltimaNotaComponent } from './components/home-page/ultima-nota/ultima-nota.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { FlashcardComponent } from './components/flashcard/flashcard.component';
import { NewEventDialogComponent } from './components/new-event-dialog/new-event-dialog.component';
import { UpdateTopicDialogComponent } from './components/flashcard/update-topic-dialog/update-topic.component';
import { UpdateFlashcardDialogComponent } from './components/flashcard/update-flashcard-dialog/update-flashcard-dialog.component';
import { MusicComponent } from './components/music/music.component';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import { ViewFlashCardComponent } from './components/home-page/view-flash-card/view-flash-card.component';
import { UpdateEventComponent } from './components/update-event/update-event.component'; 

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    PomodoroTimerComponent,
    NotFoundComponent,
    HomePageComponent,
    LoginComponent,
    RegistrationComponent,
    TimeMachineComponent,
    UserNotesComponent,
    NewNoteDialogComponent,
    NewActivityDialogComponent,
    UpdateNoteDialogComponent,
    CalendarComponent,
    GameComponent,
    TrisComponent,
    SnakeComponent,
    ImpiccatoComponent,
    PuzzleComponent,
    EventiPreviewComponent,
    UltimaNotaComponent,
    TruncatePipe,
    FlashcardComponent,
    NewEventDialogComponent,
    UpdateTopicDialogComponent,
    UpdateFlashcardDialogComponent,
    MusicComponent,
    CustomDatePipe,
    ViewFlashCardComponent,
    UpdateEventComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatIconModule,
    MatSelectModule, // Aggiungi MatSelectModule qui
    MatOptionModule

  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
