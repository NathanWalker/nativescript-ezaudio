import {Observable} from "data/observable";
var ezaudio = require("nativescript-ezaudio");
declare interface EZAudioPlayerDelegate { }
declare var EZAudioPlayer;


export class AudioPlayerTest extends Observable implements EZAudioPlayerDelegate {
  private player: any;
  private playing: boolean = false;

  constructor() {
    super();
    this.player = EZAudioPlayer.audioPlayerWithDelegate(this);
    this.set(`playTxt`, `Play Bling`);
  }
  
  public playSound() {
    if (!this.playing) {
      ezaudio.playAudioFile(this.player, `~/sounds/hotline-bling.mp3`);
    } else {
      this.player.pause();
    }
    this.togglePlaying();
  }
  
  private togglePlaying() {
    this.playing = !this.playing;
    this.set(`playTxt`, `${this.playing ? 'Stop' : 'Play'} Bling`);
  }


};