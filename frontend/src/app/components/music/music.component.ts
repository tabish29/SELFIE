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

  loadMusicList(): void {
    this.musicService.getMusicList().subscribe((list: string[]) => {
      this.musicList = list;
      if (this.musicList.length > 0) {
        this.audio.src = `http://localhost:3000/music/${this.musicList[this.currentTrackIndex]}`;
      }
    });
  }

  playTrack(index: number): void {
    if (this.musicList.length > 0) {
      this.currentTrackIndex = index;
      this.audio.src = `http://localhost:3000/music/${this.musicList[index]}`;
    }
  }

  nextTrack(): void {
    if (this.currentTrackIndex < this.musicList.length - 1) {
      this.playTrack(this.currentTrackIndex + 1);
    } else {
      this.playTrack(0);
    }
  }

  previousTrack(): void {
    if (this.currentTrackIndex > 0) {
      this.playTrack(this.currentTrackIndex - 1);
    } else {
      this.playTrack(this.musicList.length - 1);
    }
  }

  onFileUpload(event: any): void {
    console.log("sono all'interno del metodo onfileUpload", event);
    console.log("Event target files:", event.target.files);
    const file = event.target.files[0];
    if (file) {
      this.musicService.uploadFile(file).subscribe((response) => {
        this.loadMusicList();
        console.log(response);
      });
    } else {
      console.log("non esiste nessun file");
    }
  }

  deleteTrack(filename: string): void {
    this.musicService.deleteFile(filename).subscribe(() => {
      this.loadMusicList();
    });
  }
}
