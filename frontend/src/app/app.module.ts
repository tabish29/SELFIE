import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


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
import { UpdateNoteDialogComponent } from './components/update-note-dialog/update-note-dialog.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { GameComponent } from './components/game/game.component';
import { TrisComponent } from './components/game/tris/tris.component';
import { SnakeComponent } from './components/game/snake/snake.component';
import { SudokuComponent } from './components/game/sudoku/sudoku.component';
import { ImpiccatoComponent } from './components/game/impiccato/impiccato.component'; 

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
    UpdateNoteDialogComponent,
    CalendarComponent,
    GameComponent,
    TrisComponent,
    SnakeComponent,
    SudokuComponent,
    ImpiccatoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FullCalendarModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
