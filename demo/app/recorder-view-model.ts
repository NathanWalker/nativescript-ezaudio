import {Observable} from 'data/observable';
import {NSEZRecorder} from 'nativescript-ezaudio';

export class AudioRecorderDemo extends Observable {
  public footerNote: string = "<span style='font-family: sans-serif; color:#999;'>Demo by <a href='https://github.com/NathanWalker'>Nathan Walker</a></span>";
  private recorder: any;

  constructor() {
    super();
    this.recorder = new NSEZRecorder(`/tmp/recording.m4a`);
    this.set(`btnTxt`, `Start Recording`);
  }

  public toggleRecord() {
    return;
  }
  
  private toggleBtn() {
    this.set(`btnTxt`, `${this.recorder.isRecording() ? 'Stop' : 'Start'} Recording`);
  }
}