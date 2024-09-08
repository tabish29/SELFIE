import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PomodoroTimerComponent } from './components/pomodoro-timer/pomodoro-timer.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { TimeMachineComponent } from './components/time-machine/time-machine.component';
import { UserNotesComponent } from './components/user-notes/user-notes.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { GameComponent } from './components/game/game.component';
import { SnakeComponent } from './components/game/snake/snake.component';
import { TrisComponent } from './components/game/tris/tris.component';
import { ImpiccatoComponent } from './components/game/impiccato/impiccato.component';
import { PuzzleComponent } from './components/game/puzzle/puzzle.component';
import { FlashcardComponent } from './components/flashcard/flashcard.component'; 
import { accessGuard } from './guards/access.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'pomodoroTimer',
    component: PomodoroTimerComponent,
    canActivate: [accessGuard]
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [accessGuard]
  },
  {
    path: 'timeMachine',
    component: TimeMachineComponent,
    canActivate: [accessGuard]
  },
  {
    path: 'userNote',
    component: UserNotesComponent,
    canActivate: [accessGuard]
  },
  {
    path: 'home',
    component: HomePageComponent
  },
  {
    path: 'game',
    component: GameComponent,
    canActivate: [accessGuard]
  },
  {
    path: 'game/puzzle',
    component: PuzzleComponent,
    canActivate: [accessGuard]
  },
  {
    path: 'game/tris',
    component: TrisComponent,
    canActivate: [accessGuard]
  },
  {
    path: 'game/impiccato',
    component: ImpiccatoComponent,
    canActivate: [accessGuard]
  },
  {
    path: 'game/snake',
    component: SnakeComponent,
    canActivate: [accessGuard]
  },
  {
    path: 'flashCard',
    component: FlashcardComponent,
    canActivate: [accessGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    //tutti i path che non rientrano tra quelli specificati sopra
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
