import {Observable, EventData} from "data/observable";

class EZNotificationObserver extends NSObject {
  private _onReceiveCallback: (notification: NSNotification) => void;

  static new(): EZNotificationObserver {
    return <EZNotificationObserver>super.new();
  }

  public initWithCallback(onReceiveCallback: (notification: NSNotification) => void): EZNotificationObserver {
    this._onReceiveCallback = onReceiveCallback;
    return this;
  }

  public onReceive(notification: NSNotification): void {
    this._onReceiveCallback(notification);
  }

  public static ObjCExposedMethods = {
    "onReceive": { returns: interop.types.void, params: [NSNotification] }
  };
}

class NSEZAudioDelegate extends NSObject implements EZAudioPlayerDelegate {
  public static ObjCProtocols = [EZAudioPlayerDelegate];
  public player: any;
  public audioEvents: Observable;
  private _bufferEvent: EventData;
  private _observers: Array<EZNotificationObserver>;

  public initPlayer(emitBuffer?: boolean) {
    this.player = EZAudioPlayer.audioPlayerWithDelegate(this);
    // IMPORTANT: 
    // notifications can only be setup after the player has been setup in a concrete class implementation
    this.setupNotifications();
    
    if (emitBuffer) {
      this.audioEvents = new Observable();
      this._bufferEvent = {
        eventName: 'audioBuffer',
        data: {
          buffer: 0,
          bufferSize: 0
        }
      };
    }
  }
  
  // delegate notifications and events
  public audioPlayerPlayedAudioWithBufferSizeWithNumberOfChannelsInAudioFile(player: any, buffer: number, bufferSize: number, numberOfChannels: number, audioFile: any) {
    console.log(`buffer: ${buffer.value[0]}`);
    console.log(`bufferSize: ${bufferSize}`);
    if (this.audioEvents) {
      this._bufferEvent.data.buffer = buffer.value;
      this._bufferEvent.data.bufferSize = bufferSize;
      this.audioEvents.notify(this._bufferEvent);  
    }
  }

  public audioPlayerUpdatedPositionInAudioFile(player: any, framePosition: number, audioFile: any) {
    console.log(`updatedPositionInAudioFile: ${framePosition}`);
  }

  public audioPlayerReachedEndOfAudioFile(player: any, audioFile: any) {
    console.log(`reachedEndOfAudioFile`);
  }

  public didChangeAudioFile(notification: NSNotification) {
    console.log(`NSNotification: didChangeAudioFile`);
  }

  public didChangeOutputDevice(notification: NSNotification) {
    console.log(`NSNotification: didChangeOutputDevice`);
  }

  public didChangePan(notification: NSNotification) {
    console.log(`NSNotification: didChangePan`);
  }

  public didChangePlayState(notification: NSNotification) {
    console.log(`NSNotification: didChangePlayState`);
  }

  public didChangeVolume(notification: NSNotification) {
    console.log(`NSNotification: didChangeVolume`);
  }

  public didReachEndOfFile(notification: NSNotification) {
    console.log(`NSNotification: didReachEndOfFile`);
  }

  public didSeek(notification: NSNotification) {
    console.log(`NSNotification: didReachEndOfFile`);
  }

  public addNotificationObserver(notificationName: string, onReceiveCallback: (notification: NSNotification) => void): EZNotificationObserver {
    var observer = EZNotificationObserver.new().initWithCallback(onReceiveCallback);
    NSNotificationCenter.defaultCenter().addObserverSelectorNameObject(observer, "onReceive", notificationName, this.player);
    this._observers.push(observer);
    return observer;
  }

  public removeNotificationObserver(observer: any, notificationName: string) {
    var index = this._observers.indexOf(observer);
    if (index >= 0) {
      this._observers.splice(index, 1);
      NSNotificationCenter.defaultCenter().removeObserverNameObject(observer, notificationName, this.player);
    }
  }

  // Register player notifications
  // https://github.com/syedhali/EZAudio#notifications
  private setupNotifications() {
    this._observers = new Array<EZNotificationObserver>();
    this.addNotificationObserver("EZAudioPlayerDidChangeAudioFileNotification", this.didChangeAudioFile.bind(this));
    this.addNotificationObserver("EZAudioPlayerDidChangeOutputDeviceNotification", this.didChangeOutputDevice.bind(this));
    this.addNotificationObserver("EZAudioPlayerDidChangePanNotification", this.didChangePan.bind(this));
    this.addNotificationObserver("EZAudioPlayerDidChangePlayStateNotification", this.didChangePlayState.bind(this));
    this.addNotificationObserver("EZAudioPlayerDidChangeVolumeNotification", this.didChangeVolume.bind(this));
    this.addNotificationObserver("EZAudioPlayerDidReachEndOfFileNotification", this.didReachEndOfFile.bind(this));
    this.addNotificationObserver("EZAudioPlayerDidSeekNotification", this.didSeek.bind(this));
  }
}

// https://github.com/syedhali/EZAudio#EZAudioPlayer
export class NSEZAudioPlayer {
  public audioFileLoaded: boolean = false;
  private _playing: boolean = false;
  private _delegate: any;
  
  constructor(emitBuffer?: boolean) {
    this._delegate = new NSEZAudioDelegate();
    this._delegate.initPlayer(emitBuffer);
  }
  
  public delegate(): any {
    return this._delegate;
  }
  
  public play(fileName?: string, reset?: boolean) {
    if (!this.audioFileLoaded || reset) {
      this.audioFileLoaded = true;
      // Set the EZAudioFile for playback by setting the `audioFile` property
      // EZAudioFile *audioFile = [EZAudioFile audioFileWithURL:[NSURL fileURLWithPath:@"/path/to/your/file"]];
      // [self.player setAudioFile:audioFile];
      // This, however, will not pause playback if a current file is playing. Instead
      // it's encouraged to use `playAudioFile:` instead if you're swapping in a new
      // audio file while playback is already running
      this.playAudioFile(fileName);
    } else {
      this._delegate.player.play();
    }
    this._playing = true;
  }
  
  public playAudioFile(file: string) {
    var fileParts = file.split('.');
    var filePath = fileParts[0];
    var fileExt = fileParts[1];
    var soundPath = NSBundle.mainBundle().pathForResourceOfType(filePath, fileExt);
    var url = NSURL.fileURLWithPath(soundPath);
    var audioFile = EZAudioFile.audioFileWithURL(url);
    this._delegate.player.playAudioFile(audioFile);
  }

  public pause() {
    this._delegate.player.pause();
    this._playing = false;
  }

  public togglePlay(fileName?: string) {
    if (this._playing) {
      this.pause();
    } else {
      this.play(fileName);
    }
  }

  public isPlaying(): boolean {
    return this._playing;
  }
  
  public duration(): number {
    if (this.audioFileLoaded) {
      return this._delegate.player.duration;  
    } else {
      return 0;
    }  
  }
  
  public formattedDuration(): string {
    if (this.audioFileLoaded) {
      return this._delegate.player.formattedDuration;  
    } else {
      return '00:00';
    }  
  }
  
  public totalFrames(): number {
    if (this.audioFileLoaded) {
      return this._delegate.player.totalFrames;  
    } else {
      return 0;
    }  
  }
  
  public formattedCurrentTime(): string {
    if (this.audioFileLoaded) {
      return this._delegate.player.formattedCurrentTime;  
    } else {
      return '00:00';
    }  
  }
  
  public setCurrentTime(time: number): void {
    if (this.audioFileLoaded) {
      this._delegate.player.setCurrentTime(time);
    } else {
      this.noFileError();
    }
  }
  
  public volume(): number {
    if (this.audioFileLoaded) {
      return this._delegate.player.volume;  
    } else {
      return 0;
    }  
  }
  
  public setVolume(volume: number): void {
    if (this.audioFileLoaded) {
      if (volume >= 0 || volume <= 1) {
        this._delegate.player.setVolume(volume);  
      } else {
        console.log('Volume must be >= 0 or <= 1.') 
      }
    } else {
      this.noFileError();
    }
  }
  
  public pan(): number {
    if (this.audioFileLoaded) {
      return this._delegate.player.pan;  
    } else {
      return 0;
    }  
  }
  
  public setPan(pan: number): void {
    if (this.audioFileLoaded) {
      if (pan >= -1 || pan <= 1) {
        this._delegate.player.setPan(pan);  
      } else {
        console.log('Pan must be >= -1 or <= 1.'); 
      }
    } else {
      this.noFileError();
    }
  }
  
  public device(): any {
    if (this.audioFileLoaded) {
      return this._delegate.player.device;  
    } else {
      return 0;
    }  
  }
  
  private noFileError(): void {
    console.log('No audio file loaded.');
  }
}

class NSEZRecorderDelegate extends NSObject implements EZRecorderDelegate {
  public static ObjCProtocols = [EZRecorderDelegate];
  public recorder: any;
  public microphone: any;
  private _observers: Array<EZNotificationObserver>;

  public initRecorder(filePath: string) {
    this.microphone = EZMicrophone.microphoneWithDelegate(this);
    this.recorder = EZRecorder.recorderWithURLClientFormatFileType(NSURL.fileURLWithPath(filePath), this.microphone.audioStreamBasicDescription, EZRecorderFileTypeM4A);
    this.recorder.delegate = this;
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
  
  public recorderUpdatedCurrentTime(recorder) {
    console.log('recorderUpdatedCurrentTime');
    // __weak typeof (self) weakSelf = self;
    // // This will get triggerd on the thread that the write occured on so be sure to wrap your UI
    // // updates in a GCD main queue block! However, I highly recommend you first pull the values
    // // you'd like to update the interface with before entering the GCD block to avoid trying to
    // // fetch a value after the audio file has been closed.
    // NSString *formattedCurrentTime = [recorder formattedCurrentTime]; // MM:SS formatted
    // dispatch_async(dispatch_get_main_queue(), ^{
    //     // Update label
    //     weakSelf.currentTimeLabel.stringValue = formattedCurrentTime;
    // });
  }
  
  public microphoneHasAudioReceivedWithBufferSizeWithNumberOfChannels(microphone, buffer, bufferSize, numberOfChannels) {
    console.log(`record buffer: ${buffer.value[0]}`);
    console.log(`record bufferSize: ${bufferSize}`);
    // __weak typeof (self) weakSelf = self;
    // // Getting audio data as an array of float buffer arrays that can be fed into the
    // // EZAudioPlot, EZAudioPlotGL, or whatever visualization you would like to do with
    // // the microphone data.
    // dispatch_async(dispatch_get_main_queue(),^{
    //     // Visualize this data brah, buffer[0] = left channel, buffer[1] = right channel
    //     [weakSelf.audioPlot updateBuffer:buffer[0] withBufferSize:bufferSize];
    // });
  }
  
  public microphoneChangedDevice(device) {
    console.log(`Changed input device: ${device}`);
  }
  
  public recorderDidClose(recorder) {
    this.recorder.delegate = undefined;
  }
}

// https://github.com/syedhali/EZAudio#EZRecorder
export class NSEZRecorder {
  private _recording: boolean = false;
  private _delegate: NSEZRecorderDelegate;
  
  constructor(filePath: string) {
    this._delegate = new NSEZRecorderDelegate();
    this._delegate.initRecorder(filePath);
  }
  
  public record() {
    this._delegate.microphone.startFetchingAudio();
    this._recording = true;
  }
  
  public stop() {
    this._delegate.microphone.stopFetchingAudio();
    this._recording = false;
  }
  
  public finish() {
    this._delegate.finish();
    this._recording = false;
  }
  
  public isRecording(): boolean {
    return this._recording;
  }
  
  public deviceInputs(): Array<any> {
    return EZAudioDevice.inputDevices;
  }
  
  public setDevice(device): void {
    this._delegate.microphone.setDevice(device);
  }
}