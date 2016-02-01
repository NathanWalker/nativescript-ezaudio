import {Observable} from "data/observable";
var ezaudio = require("nativescript-ezaudio");

// NSNotificationCenter
// https://developer.apple.com/library/mac/documentation/Cocoa/Reference/Foundation/Classes/NSNotificationCenter_Class/index.html
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

// Delegate for EZAudio to communicate
// https://github.com/syedhali/EZAudio#playing-an-audio-file
class EZDelegate extends NSObject implements EZAudioPlayerDelegate {
  public static ObjCProtocols = [EZAudioPlayerDelegate];
  public player: any;
  public audioFileLoaded: boolean = false;
  private _observers: Array<EZNotificationObserver>;
  private _playing: boolean = false;

  constructor() {
    super();
  }

  public setPlayer(player: any) {
    this.player = player;
    // IMPORTANT: 
    // notifications can only be setup after the player has been setup in a concrete class implementation
    this.setupNotifications();
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
      ezaudio.playAudioFile(this.player, fileName);
    } else {
      this.player.play();
    }
    this._playing = true;
  }

  public pause() {
    this.player.pause();
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

  public audioPlayerPlayedAudioWithBufferSizeWithNumberOfChannelsInAudioFile(player: any, buffer: number, bufferSize: number, numberOfChannels: number, audioFile: any) {
    console.log(`buffer: ${buffer.value[0]}`);
    console.log(`bufferSize: ${bufferSize}`);
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

export class AudioPlayerDemo extends Observable {
  public footerNote: string = "<span style='font-family: sans-serif;'>Demo by <a href='https://github.com/NathanWalker'>Nathan Walker</a></span>";
  private delegate: any;
  private currentTrackIndex: number = 0;
  private tracks: Array<string> = [
    `sounds/hotline-bling.mp3`,
    `sounds/harder-better-faster.mp3`
  ];

  constructor() {
    super();
    this.delegate = new EZDelegate();
    this.delegate.setPlayer(EZAudioPlayer.audioPlayerWithDelegate(this.delegate));
    this.set(`btnTxt`, `Play Track`);
  }

  public toggleCurrentTrack(reset?: boolean) {
    this.delegate.togglePlay(this.tracks[this.currentTrackIndex], reset);
    this.toggleBtn();
    console.log(`currentTrack: ${this.tracks[this.currentTrackIndex]}`);
  }
  
  public swapTrack() {
    this.currentTrackIndex = this.currentTrackIndex === 0 ? 1 : 0;
    this.toggleCurrentTrack(true);
  }
  
  private toggleBtn() {
    this.set(`btnTxt`, `${this.delegate.isPlaying() ? 'Stop' : 'Play'} Track`);
  }
};