/**
 * iOS
 */
import {EZNotificationObserver} from './core';

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