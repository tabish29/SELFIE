import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './services/local-storage.service';
import { TimeMachineService } from './services/time-machine.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(
    private localStorageService: LocalStorageService,
    private timeMachineService: TimeMachineService
  ) { }

  ngOnInit(): void {
    /*if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.clearLocalStorage);
    }*/

    const username = this.localStorageService.getItem('username');

    if (username) {
      this.timeMachineService.startAutoUpdate(username, 60000);
    }
  }

  ngOnDestroy(): void {
   if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.clearLocalStorage);
    } 
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }

}
