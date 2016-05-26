import {Observable} from 'data/observable';
import * as fs from 'file-system';
import {NSEZRecorder} from 'nativescript-ezaudio';

export class AudioRecorderDemo extends Observable {
  public footerNote: string = "<span style='font-family: sans-serif; color:#999;'>Demo by <a href='https://github.com/NathanWalker'>Nathan Walker</a></span>";
  private recorder: any;

  constructor() {
    super();
    this.recorder = new NSEZRecorder();
    this.set(`btnTxt`, `Start Recording`);
  }

  public toggleRecord() {
    if (this.recorder.isRecording()) {
      this.recorder.stop();
    } else {
      var audioFolder = fs.knownFolders.currentApp().getFolder("audio");
      console.log(JSON.stringify(audioFolder));  
      this.recorder.record(`${audioFolder.path}/recording.m4a`);  
    }
    // this.toggleBtn();
  }
  
  private toggleBtn() {
    this.set(`btnTxt`, `${this.recorder.isRecording() ? 'Stop' : 'Start'} Recording`);
  }
}