import {Observable} from 'data/observable';
import * as fs from 'file-system';
import {TNSEZRecorder, TNSEZAudioPlayer} from 'nativescript-ezaudio';

export class AudioRecorderDemo extends Observable {
  public footerNote: string = "<span style='font-family: sans-serif; color:#999;'>Demo by <a href='https://github.com/NathanWalker'>Nathan Walker</a></span>";

  // AudioPlot
  public audioPlotColor: string = '#FFF803';
  public audioPlotType: string = 'buffer';
  public audioPlotFill: boolean = true;
  public audioPlotMirror: boolean = true;
  public audioPlotBufferData: any;
  public recordTime: string;
  public showPlayBtn: boolean = false;
  public playBtnTxt: string;
  
  private _recorder: any;
  private _player: any;
  private _recordingPath: string;
  private _reloadPlayer: boolean = false;

  constructor() {
    super();
    this._recorder = new TNSEZRecorder();
    this._recorder.delegate().audioEvents.on('audioBuffer', (eventData) => {
      this.set('audioPlotBufferData', {
        buffer: eventData.data.buffer,
        bufferSize: eventData.data.bufferSize
      });
    });
    this._recorder.delegate().audioEvents.on('recordTime', (eventData) => {
      this.set('recordTime', eventData.data.time);
    });

    // player
    this._player = new TNSEZAudioPlayer(true);
    this._player.delegate().audioEvents.on('audioBuffer', (eventData) => {
      this.set('audioPlotBufferData', {
        buffer: eventData.data.buffer,
        bufferSize: eventData.data.bufferSize
      });
    });
    
    this.set(`btnTxt`, `Start Recording`);
    this.set(`playBtnTxt`, `Play`);
  }

  public toggleRecord() {
    if (this._recorder.isRecording()) {
      this._recorder.stop();
      this.set('showPlayBtn', true);
      this._reloadPlayer = true;
    } else {
      var audioFolder = fs.knownFolders.currentApp().getFolder("audio");
      console.log(JSON.stringify(audioFolder));  
      this._recordingPath = `${audioFolder.path}/recording.m4a`;
      this._recorder.record(this._recordingPath);  
    }
    this.toggleBtn();
  }

  public togglePlay() {
    this._player.togglePlay(this._recordingPath, this._reloadPlayer);
    this.togglePlayBtn();
    this._reloadPlayer = false;
  }
  
  private toggleBtn() {
    this.set(`btnTxt`, `${this._recorder.isRecording() ? 'Stop' : 'Start'} Recording`);
  }

  private togglePlayBtn() {
    this.set(`playBtnTxt`, `${this._player.isPlaying() ? 'Stop' : 'Play'}`);
  }
}