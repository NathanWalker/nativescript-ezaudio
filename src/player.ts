import {Observable, EventData} from 'data/observable';
import {EZNotificationObserver} from './core';

declare var EZAudioFile: any, EZAudioPlayerDelegate: any, EZAudioPlayer: any;

class TNSEZAudioDelegate extends NSObject implements EZAudioPlayerDelegate {
  public static ObjCProtocols = [EZAudioPlayerDelegate];
  public player: any;
  public audioEvents: Observable;
  private _bufferEvent: EventData;
  private _positionEvent: EventData;
  private _reachedEndEvent: EventData;
  private _changeAudioFileEvent: EventData;
  private _changeOutputEvent: EventData;
  private _changePanEvent: EventData;
  private _changeVolumeEvent: EventData;
  private _changePlayStateEvent: EventData;
  private _seekedEvent: EventData;
  private _observers: Array<EZNotificationObserver>;

  public initPlayer(emitEvents?: boolean) {
    // this.player = EZAudioPlayer.audioPlayerWithDelegate(this);
    this.player = EZAudioPlayer.sharedAudioPlayer();
    this.player.delegate = this;
    
    // IMPORTANT: notifications can only be setup after the player has been setup in a concrete class implementation
    this.setupNotifications();
    
    if (emitEvents) {
      this.setupEvents();
    }
  }
  
  // delegate notifications and events
  public audioPlayerPlayedAudioWithBufferSizeWithNumberOfChannelsInAudioFile(player: any, buffer: number, bufferSize: number, numberOfChannels: number, audioFile: any) {
    // console.log(`buffer: ${buffer.value[0]}`);
    // console.log(`bufferSize: ${bufferSize}`);
    if (this.audioEvents) {
      this._bufferEvent.data.buffer = buffer.value;
      this._bufferEvent.data.bufferSize = bufferSize;
      this.audioEvents.notify(this._bufferEvent);  
    }
  }

  public audioPlayerUpdatedPositionInAudioFile(player: any, framePosition: number, audioFile: any) {
    // console.log(`updatedPositionInAudioFile: ${framePosition}`);
    if (this.audioEvents) {
      this._positionEvent.data.position = framePosition;
      this.audioEvents.notify(this._positionEvent);  
    }
  }

  public didChangeAudioFile(notification: NSNotification) {
    // console.log(`NSNotification: didChangeAudioFile`);
    if (this.audioEvents) {
      this.audioEvents.notify(this._changeAudioFileEvent);  
    }
  }

  public didChangeOutputDevice(notification: NSNotification) {
    // console.log(`NSNotification: didChangeOutputDevice`);
    if (this.audioEvents) {
      this.audioEvents.notify(this._changeOutputEvent);  
    }
  }

  public didChangePan(notification: NSNotification) {
    // console.log(`NSNotification: didChangePan`);
    if (this.audioEvents) {
      this.audioEvents.notify(this._changePanEvent);  
    }
  }

  public didChangePlayState(notification: NSNotification) {
    // console.log(`NSNotification: didChangePlayState`);
    if (this.audioEvents) {
      this.audioEvents.notify(this._changePlayStateEvent);  
    }
  }

  public didChangeVolume(notification: NSNotification) {
    // console.log(`NSNotification: didChangeVolume`);
    if (this.audioEvents) {
      this.audioEvents.notify(this._changeVolumeEvent);  
    }
  }

  public didReachEndOfFile(notification: NSNotification) {
    // console.log(`NSNotification: didReachEndOfFile`);
    if (this.audioEvents) {
      this.audioEvents.notify(this._reachedEndEvent);  
    }
  }

  public didSeek(notification: NSNotification) {
    // console.log(`NSNotification: didSeek`);
    if (this.audioEvents) {
      this.audioEvents.notify(this._seekedEvent);  
    }
  }

  private addNotificationObserver(notificationName: string, onReceiveCallback: (notification: NSNotification) => void): EZNotificationObserver {
    var observer = EZNotificationObserver.new().initWithCallback(onReceiveCallback);
    NSNotificationCenter.defaultCenter().addObserverSelectorNameObject(observer, "onReceive", notificationName, this.player);
    this._observers.push(observer);
    return observer;
  }

  private removeNotificationObserver(observer: any, notificationName: string) {
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
  
  private setupEvents() {
    this.audioEvents = new Observable();
    this._bufferEvent = {
      eventName: 'audioBuffer',
      data: {
        buffer: 0,
        bufferSize: 0
      }
    };
    this._positionEvent = {
      eventName: 'position',
      data: {
        position: 0
      }
    };
    this._reachedEndEvent = {
      eventName: 'reachedEnd'
    };
    this._changeAudioFileEvent = {
      eventName: 'changeAudioFile'
    };
    this._changeOutputEvent = {
      eventName: 'changeOutput'
    };
    this._changePanEvent = {
      eventName: 'changePan'
    };
    this._changeVolumeEvent = {
      eventName: 'changeVolume'
    };
    this._changePlayStateEvent = {
      eventName: 'changePlayState'
    };
    this._seekedEvent = {
      eventName: 'seeked'
    };
  }
}

// https://github.com/syedhali/EZAudio#EZAudioPlayer
export class TNSEZAudioPlayer {
  private _audioFileLoaded: boolean = false;
  private _currentAudioFile: EZAudioFile;
  private _currentAudioFilePath: string;
  private _playing: boolean = false;
  private _delegate: any;
  private _playbackSession: any;
  
  constructor(emitEvents?: boolean) {
    this._delegate = new TNSEZAudioDelegate();
    this._delegate.initPlayer(emitEvents);
  }
  
  public delegate(): any {
    return this._delegate;
  }
  
  public togglePlay(fileName?: string, reloadTrack?: boolean) {
    if (!this._audioFileLoaded || reloadTrack) {
      this._playbackSession = AVAudioSession.sharedInstance();
      let errorRef = new interop.Reference();
      this._playbackSession.setCategoryError(AVAudioSessionCategoryPlayback, errorRef);
      if (errorRef) {
        console.log(`setCategoryError: ${errorRef.value}`);
      }
      this._playbackSession.setActiveError(true, null);
      this.loadAndPlayAudioFile(fileName);
    } else if (this._playing) {
      this.pause();
    } else {
      this._delegate.player.play();
      this._playing = true;
    }   
  }

  public pause() {
    this._delegate.player.pause();
    this._playing = false;
  }

  public isPlaying(): boolean {
    return this._playing;
  }
  
  public duration(): number {
    if (this._audioFileLoaded) {
      return this._delegate.player.duration;  
    } else {
      return 0;
    }  
  }
  
  public formattedDuration(): string {
    if (this._audioFileLoaded) {
      return this._delegate.player.formattedDuration;  
    } else {
      return '00:00';
    }  
  }
  
  public totalFrames(): number {
    if (this._audioFileLoaded) {
      return this._delegate.player.totalFrames;  
    } else {
      return 0;
    }  
  }
  
  public formattedCurrentTime(): string {
    if (this._audioFileLoaded) {
      return this._delegate.player.formattedCurrentTime;  
    } else {
      return '00:00';
    }  
  }
  
  public setCurrentTime(time: number): void {
    if (this._audioFileLoaded) {
      this._delegate.player.setCurrentTime(time);
    } else {
      this.noFileError();
    }
  }
  
  public seekToFrame(frame: number): void {
    if (this._audioFileLoaded) {
      this._delegate.player.seekToFrame(frame);
    } else {
      this.noFileError();
    }
  }
  
  public volume(): number {
    if (this._audioFileLoaded) {
      return this._delegate.player.volume;  
    } else {
      return 0;
    }  
  }
  
  public setVolume(volume: number): void {
    if (this._audioFileLoaded) {
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
    if (this._audioFileLoaded) {
      return this._delegate.player.pan;  
    } else {
      return 0;
    }  
  }
  
  public setPan(pan: number): void {
    if (this._audioFileLoaded) {
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
    if (this._audioFileLoaded) {
      return this._delegate.player.device;  
    } else {
      return 0;
    }  
  }
  
  private loadAndPlayAudioFile(file: string) {
    let soundPath = file;
    if (file.indexOf('/') !== 0) {
      // using relative path, resolve to bundle
      let fileParts = file.split('.');
      let filePath = fileParts[0];
      let fileExt = fileParts[1];
      soundPath = NSBundle.mainBundle().pathForResourceOfType(filePath, fileExt);
    }
    let url = NSURL.fileURLWithPath(soundPath);
    this._currentAudioFile = EZAudioFile.audioFileWithURL(url);
    this._delegate.player.playAudioFile(this._currentAudioFile);  
    this._audioFileLoaded = true;
    this._playing = true;
  }
  
  private noFileError(): void {
    console.log('No audio file loaded.');
  }
}