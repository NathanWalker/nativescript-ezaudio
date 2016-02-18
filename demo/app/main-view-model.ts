import {Observable} from 'data/observable';
import placeholder = require("ui/placeholder");
import {Color} from "color";
var _ = require('lodash');
import {NSEZAudioPlayer} from 'nativescript-ezaudio';

export class AudioPlayerDemo extends Observable {
  public footerNote: string = "<span style='font-family: sans-serif; color:#999;'>Demo by <a href='https://github.com/NathanWalker'>Nathan Walker</a></span>";
  public framePosition: number = 0;
  public totalFrames: number = 100;
  public currentTime: string = '00:00';
  public totalDuration: string = '00:00';
  public outputs: Array<string>;
  public selectedOutput: number = 0;
  public plotStyles: Array<any> = [
    { title: 'Buffer' },
    { title: 'Rolling' }
  ];
  public plotFill: Array<any> = [
    { title: 'On' },
    { title: 'Off' }
  ];
  public plotColors: Array<any> = [
    { title: 'Yellow' },
    { title: 'Blue' },
    { title: 'Green' },
    { title: 'Purple' }
  ];
  public selectedPlotStyle: number = 0;
  private player: any;
  private audioPlot: EZAudioPlot;
  private currentTrackIndex: number = 0;
  private tracks: Array<string> = [
    `sounds/hotline-bling.mp3`,
    `sounds/harder-better-faster.mp3`
  ];

  constructor() {
    super();
    this.set(`btnTxt`, `Play Track`);
    this.player = new NSEZAudioPlayer(true);
    this.player.delegate().audioEvents.on('audioBuffer', (eventData) => {
      this.audioPlot.updateBufferWithBufferSize(eventData.data.buffer, eventData.data.bufferSize);
    });
    this.player.delegate().audioEvents.on('position', this.updateSlider.bind(this));
    this.on(Observable.propertyChangeEvent, _.debounce(this.seekToFrame.bind(this), 200));
    this.set('outputs', EZAudioDevice.outputDevices());
    console.log(this.outputs);
  }

  public toggleCurrentTrack(reset?: boolean) {
    this.player.togglePlay(this.tracks[this.currentTrackIndex], reset);
    this.toggleBtn();
    console.log(`currentTrack: ${this.tracks[this.currentTrackIndex]}`);
    this.set('totalFrames', this.player.totalFrames());
    console.log(`---- totalFrames: ${this.totalFrames}`);
    console.log(`---- duration: ${this.player.duration()}`);
    this.set('totalDuration', this.player.formattedDuration());
    console.log(`---- currentTime: ${this.currentTime}`);
    
  }
  
  public swapTrack() {
    this.currentTrackIndex = this.currentTrackIndex === 0 ? 1 : 0;
    this.toggleCurrentTrack(true);
  }
  
  public createAudioPlot(args: placeholder.CreateViewEventData) {
    console.log('--------- createAudioPlot ---------');
    this.audioPlot = EZAudioPlot.alloc().initWithFrame(CGRectMake(0, 0, UIApplication.sharedApplication().statusBarFrame.size.width, 500));
    this.audioPlot.color = new Color('#FFF803').ios;
    this.audioPlot.plotType = EZPlotTypeBuffer;
    this.audioPlot.shouldFill = true;
    this.audioPlot.shouldMirror = true;
    args.view = this.audioPlot;
  }
  
  public changePlotColor(data) {
    let color = '#FFF803';
    switch (data.newIndex) {
      case 0:
        color = '#FFF803';
        break;
      case 1:
        color = '#34C0FF';
        break;
      case 2:
        color = '#00FF17';
        break;
      case 3:
        color = '#FF45F9';
        break;
    }
    this.audioPlot.color = new Color(color).ios;
  }
  
  public changePlotType(data) {
    this.audioPlot.plotType = data.newIndex == 1 ? EZPlotTypeRolling : EZPlotTypeBuffer;
  }
  
  public changePlotFill(data) {
    this.audioPlot.shouldFill = !this.audioPlot.shouldFill;
  }
  
  public changePlotMirror(data) {
    this.audioPlot.shouldMirror = !this.audioPlot.shouldMirror;
  }
  
  private updateSlider(eventData) {
    // console.log(`position event: ${eventData.data.position}`);
    // this.set('framePosition', Math.ceil((eventData.data.position / this.totalFrames) * 100));
    this.set('framePosition', eventData.data.position);
    console.log(`event framePosition: ${this.framePosition}`);
    this.set('currentTime', this.player.formattedCurrentTime());
  }
  
  private seekToFrame(propertyChangeData) {
    if (propertyChangeData && propertyChangeData.propertyName == 'framePosition') {
      console.log(`propertyChangeEvent: ${Math.ceil(propertyChangeData.value)}`);  
      this.player.seekToFrame(Math.ceil(propertyChangeData.value));
    }
  }
  
  private toggleBtn() {
    this.set(`btnTxt`, `${this.player.isPlaying() ? 'Stop' : 'Play'} Track`);
  }
}
