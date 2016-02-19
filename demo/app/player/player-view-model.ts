import {Observable} from 'data/observable';
import placeholder = require("ui/placeholder");
import {Color} from "color";
var _ = require('lodash');
import {NSEZAudioPlayer} from 'nativescript-ezaudio';

export class AudioPlayerDemo extends Observable {
  public footerNote: string = "<span style='font-family: sans-serif; color:#999; padding:15;'>Demo by <a href='https://github.com/NathanWalker'>Nathan Walker</a></span>";
  
  // AudioPlot
  public audioPlotColor: string = '#FFF803';
  public audioPlotType: string = 'buffer';
  public audioPlotFill: boolean = true;
  public audioPlotMirror: boolean = true;
  public audioPlotBufferData: any;
  
  // UI controls
  public framePosition: number = 0;
  public totalFrames: number = 100;
  public currentTime: string = '00:00';
  public totalDuration: string = '00:00';
  public outputs: any;
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
  
  // internal
  private _player: any;
  private _plotType: string = 'buffer';
  private _currentTrackIndex: number = 0;
  private _tracks: Array<string> = [
    `sounds/hotline-bling.mp3`,
    `sounds/harder-better-faster.mp3`
  ];

  constructor(page: any) {
    super();
    this.set(`btnTxt`, `Play Track`);
    this._player = new NSEZAudioPlayer(true);
    this._player.delegate().audioEvents.on('audioBuffer', (eventData) => {
      this.set('audioPlotBufferData', {
        buffer: eventData.data.buffer,
        bufferSize: eventData.data.bufferSize
      });
    });
    this._player.delegate().audioEvents.on('position', (eventData) => {
      // console.log(`event framePosition: ${this.framePosition}`);
      this.set('framePosition', eventData.data.position);
      this.set('currentTime', this._player.formattedCurrentTime());
      this.set('totalFrames', this._player.totalFrames());
      this.set('totalDuration', this._player.formattedDuration());
    });
    this._player.delegate().audioEvents.on('changeAudioFile', (eventData) => {
      console.log('changeAudioFile');
    });
    this.on(Observable.propertyChangeEvent, _.debounce(this.seekToFrame.bind(this), 500, {leading: true}));
    this.set('outputs', EZAudioDevice.outputDevices());
    console.log(this.outputs);
  }

  public toggleCurrentTrack(e: any, reset?: boolean) {
    this._player.togglePlay(this._tracks[this._currentTrackIndex], reset);
    if (e) {
      // only toggle btn state when triggered via view (e will be a valid ui event)
      this.toggleBtn();  
    }
    this.set('totalFrames', this._player.totalFrames());
    this.set('totalDuration', this._player.formattedDuration());
    console.log(`currentTrack: ${this._tracks[this._currentTrackIndex]}`);
    console.log(`---- totalFrames: ${this.totalFrames}`);
    console.log(`---- duration: ${this._player.duration()}`);
    console.log(`---- currentTime: ${this.currentTime}`);
  }
  
  public swapTrack() {
    this._currentTrackIndex = this._currentTrackIndex === 0 ? 1 : 0;
    this.toggleCurrentTrack(null, true);
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
    this.set('audioPlotColor', color);
  }
  
  public changePlotType(data) {
    this.set('audioPlotType', data.newIndex == 1 ? 'rolling' : 'buffer');
  }
  
  public changePlotFill(data) {
    this.set('audioPlotFill', !this.audioPlotFill);
  }
  
  public changePlotMirror(data) {
    this.set('audioPlotMirror', !this.audioPlotMirror);
  }
  
  private seekToFrame(propertyChangeData) {
    if (propertyChangeData && propertyChangeData.propertyName == 'framePosition') {
      console.log(`propertyChangeEvent: ${Math.ceil(propertyChangeData.value)}`);  
      this._player.seekToFrame(Math.ceil(propertyChangeData.value));
    }
  }
  
  private toggleBtn() {
    this.set(`btnTxt`, `${this._player.isPlaying() ? 'Stop' : 'Play'} Track`);
  }
}
