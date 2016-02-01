import {Observable} from "data/observable";
var ezaudio = require("nativescript-ezaudio");

var EZDelegate = NSObject.extend({
  playedAudioWithBufferSizeWithNumberOfChannelsInAudioFile(player: any, buffer: number, bufferSize: number, numberOfChannels: number, audioFile: any) {
    console.log(`buffer: ${buffer}`);
    console.log(`bufferSize: ${buffer}`);
    console.log(`numberOfChannels: ${numberOfChannels}`);
  },
  updatedPositionInAudioFile(player: any, framePosition: number, audioFile: any) {
    console.log(`updatedPositionInAudioFile: ${framePosition}`);
  }
},
{
  protocols: [EZAudioPlayerDelegate]
});

export class AudioPlayerTest extends Observable {
  public footerNote: string = "<span style='font-family: sans-serif;'>Demo by <a href='https://github.com/NathanWalker'>Nathan Walker</a></span>";
  private player: any;
  private playing: boolean = false;

  constructor() {
    super();
    this.player = EZAudioPlayer.audioPlayerWithDelegate(EZDelegate);
    this.set(`playTxt`, `Play Bling`);
  }

  public playSound() {
    if (!this.playing) {
      ezaudio.playAudioFile(this.player, `sounds/hotline-bling.mp3`);
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