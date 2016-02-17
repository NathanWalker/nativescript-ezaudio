import {Observable} from 'data/observable';
import placeholder = require("ui/placeholder");
import {Color} from "color";
import {NSEZAudioPlayer} from 'nativescript-ezaudio';

export class AudioPlayerDemo extends Observable {
  public footerNote: string = "<span style='font-family: sans-serif; color:#999;'>Demo by <a href='https://github.com/NathanWalker'>Nathan Walker</a></span>";
  private player: any;
  private audioPlot: EZAudioPlot;
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
  
  public createAudioPlot(args: placeholder.CreateViewEventData) {
    console.log('--------- createAudioPlot ---------');
    this.audioPlot = EZAudioPlot.alloc().initWithFrame(CGRectMake(0, 0, UIApplication.sharedApplication().statusBarFrame.size.width, 300));
    this.audioPlot.backgroundColor = new Color('#000').ios;
    this.audioPlot.color = new Color('#FFF803').ios;
    this.audioPlot.plotType = EZPlotTypeBuffer;
    this.audioPlot.shouldFill = true;
    this.audioPlot.shouldMirror = true;
    args.view = this.audioPlot;
  }
  
  private toggleBtn() {
    this.set(`btnTxt`, `${this.player.isPlaying() ? 'Stop' : 'Play'} Track`);
  }
}
