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
    component: PomodoroTimerComponent
  },
  {
    path: 'calendar',
    component: CalendarComponent
  },
  {
    path: 'timeMachine',
    component: TimeMachineComponent
  },
  {
    path: 'userNote',
    component: UserNotesComponent
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'game',
    component: GameComponent,
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
