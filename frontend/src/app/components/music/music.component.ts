import { Component } from '@angular/core';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrl: './music.component.css'
})
export class MusicComponent {
  musicList: string[] = [];   
  currentTrackIndex = 0;     
  audio = new Audio();    

  constructor(private musicService: MusicService) { }

  ngOnInit(): void {
    this.loadMusicList();
  }

  // Carica la lista dei file MP3
  loadMusicList(): void {
    this.musicService.getMusicList().subscribe((list: string[]) => {
      this.musicList = list;
    });
  }

  // Riproduce una traccia selezionata
  playTrack(index: number): void {
    if (this.musicList.length > 0) {
      this.currentTrackIndex = index;
      this.audio.src = `http://localhost:3000/music/${this.musicList[index]}`; 
      this.audio.load();
      this.audio.play();
    }
  }

  // Metodo per passare alla traccia successiva
  nextTrack(): void {
    if (this.currentTrackIndex < this.musicList.length - 1) {
      this.playTrack(this.currentTrackIndex + 1);
    }
  }

  // Metodo per tornare alla traccia precedente
  previousTrack(): void {
    if (this.currentTrackIndex > 0) {
      this.playTrack(this.currentTrackIndex - 1);
    }
  }

  // Metodo per mettere in pausa la riproduzione
  pauseTrack(): void {
    this.audio.pause();
  }

  // Metodo per caricare un file MP3
  onFileUpload(event: any): void {
    console.log("sono all'interno del metodo onfileUpload", event);
    console.log("Event target files:", event.target.files);
    const file = event.target.files[0];
    if (file) {
      this.musicService.uploadFile(file).subscribe((response) => {
        //this.loadMusicList(); // Ricarica la lista dopo l'upload
        console.log(response);
      });
    }else{
      console.log("non esiste nessun file");
    }
  }

  // Metodo per eliminare un file MP3
  deleteTrack(filename: string): void {
    this.musicService.deleteFile(filename).subscribe(() => {
      this.loadMusicList(); 
    });
  }
}
