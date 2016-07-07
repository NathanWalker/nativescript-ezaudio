/**
 * iOS
 */
import {Observable, EventData} from 'data/observable';
import {EZNotificationObserver} from './core';

class TNSEZRecorderDelegate extends NSObject {
  public static ObjCProtocols = [EZRecorderDelegate, EZMicrophoneDelegate];
  public recorder: any;
  public microphone: any;
  public audioEvents: Observable;
  public isRecording: boolean = false;
  private _recordingSession: any;
  private _observers: Array<EZNotificationObserver>;
  private _bufferEvent: EventData;
  private _recordTimeEvent: EventData;

  public initRecorder() {
    this.initSession();
    this._recordingSession.requestRecordPermission((allowed: boolean) => {
      if (allowed) {
        this.microphone = EZMicrophone.microphoneWithDelegate(this);
        // errorRef = new interop.Reference();
        // this._recordingSession.overrideOutputAudioPortError(AVAudioSessionPortOverrideSpeaker, errorRef);
        // if (errorRef) {
        //     console.log(`Error overriding output to the speaker: ${errorRef.localizedDescription}`);
        // }
        this.setupEvents();
      }
    });
  }

  private initSession() {
    this._recordingSession = AVAudioSession.sharedInstance();
    let errorRef = new interop.Reference();
    //AVAudioSessionCategoryRecord
    //AVAudioSessionCategoryPlayAndRecord
    this._recordingSession.setCategoryError(AVAudioSessionCategoryPlayAndRecord, errorRef);
    if (errorRef) {
      console.log(`setCategoryError: ${errorRef.value}`);
    }
    this._recordingSession.setActiveError(true, null);
  }

  public toggleRecord(filePath?: string) {
    if (this.isRecording) {
      this.microphone.stopFetchingAudio();
      this.finish();
    } else {
      this.initSession();
      this.microphone.startFetchingAudio();

      this.recorder = EZRecorder.recorderWithURLClientFormatFileTypeDelegate(NSURL.fileURLWithPath(filePath), this.microphone.audioStreamBasicDescription(), EZRecorderFileTypeM4A, this);
    }
    this.isRecording = !this.isRecording;
  }
  
  public finish() {
    this.recorder.closeAudioFile();
  }
  
  // delegate notifications and events
  public microphoneHasBufferListWithBufferSizeWithNumberOfChannels(microphone, bufferList, bufferSize, numberOfChannels) {
    if (this.isRecording) {
       this.recorder.appendDataFromBufferListWithBufferSize(bufferList, bufferSize);
    }
  }
  
  public recorderUpdatedCurrentTime(recorder:any) {
    let formattedCurrentTime = recorder.formattedCurrentTime;
    console.log(`recording time: ${formattedCurrentTime}`);
    if (this.audioEvents) {
      this._recordTimeEvent.data.time = formattedCurrentTime;
      this.audioEvents.notify(this._recordTimeEvent);  
    }
  }
  
  public microphoneHasAudioReceivedWithBufferSizeWithNumberOfChannels(microphone, buffer, bufferSize, numberOfChannels) {
    // console.log(`record buffer: ${buffer.value[0]}`);
    // console.log(`record bufferSize: ${bufferSize}`);
    if (this.audioEvents) {
      this._bufferEvent.data.buffer = buffer.value;
      this._bufferEvent.data.bufferSize = bufferSize;
      this.audioEvents.notify(this._bufferEvent);  
    }
  }
  
  public microphoneChangedDevice(device) {
    console.log(`Changed input device: ${device}`);
  }

  public microphoneChangedPlayingState(mic: any, isPlaying: boolean) {
    console.log(`microphone changed state: ${isPlaying}`);
  }
  
  public recorderDidClose(recorder) {
    this.recorder.delegate = undefined;
  }

  private setupEvents() {
    this.audioEvents = new Observable();
    this._bufferEvent = {
      eventName: 'audioBuffer',
      data: {
        buffer: 0,
        bufferSize: 0
      }
    };
    this._recordTimeEvent = {
      eventName: 'recordTime',
      data: {
        time: 0
      }
    };
  }
}

// https://github.com/syedhali/EZAudio#EZRecorder
export class TNSEZRecorder {
  private _delegate: TNSEZRecorderDelegate;
  
  constructor() {
    this._delegate = new TNSEZRecorderDelegate();
    this._delegate.initRecorder();
  }

  public delegate(): any {
    return this._delegate;
  }
  
  public record(filePath: string) {
    this._delegate.toggleRecord(filePath);
  }
  
  public stop() {
    this._delegate.toggleRecord();
  }
  
  public finish() {
    this._delegate.finish();
  }
  
  public isRecording(): boolean {
    return this._delegate.isRecording;
  }
  
  public deviceInputs(): Array<any> {
    return EZAudioDevice.inputDevices;
  }
  
  public setDevice(device): void {
    this._delegate.microphone.setDevice(device);
  }
}