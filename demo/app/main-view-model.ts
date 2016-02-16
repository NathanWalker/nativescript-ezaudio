import {Observable} from 'data/observable';
import {NSEZAudioPlayer} from 'nativescript-ezaudio';

export class AudioPlayerDemo extends Observable {
  public footerNote: string = "<span style='font-family: sans-serif; color:#999;'>Demo by <a href='https://github.com/NathanWalker'>Nathan Walker</a></span>";
  private player: any;
  private currentTrackIndex: number = 0;
  private tracks: Array<string> = [
    `sounds/hotline-bling.mp3`,
    `sounds/harder-better-faster.mp3`
  ];

  constructor() {
    super();
    this.player = new NSEZAudioPlayer();
    this.set(`btnTxt`, `Play Track`);
  }

  public toggleCurrentTrack(reset?: boolean) {
    this.player.togglePlay(this.tracks[this.currentTrackIndex], reset);
    this.toggleBtn();
    console.log(`currentTrack: ${this.tracks[this.currentTrackIndex]}`);
  }
  
  public swapTrack() {
    this.currentTrackIndex = this.currentTrackIndex === 0 ? 1 : 0;
    this.toggleCurrentTrack(true);
  }
  
  private toggleBtn() {
    this.set(`btnTxt`, `${this.player.isPlaying() ? 'Stop' : 'Play'} Track`);
  }
}