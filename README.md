![alt text](http://i.imgur.com/ll5q68r.png "EZAudioLogo")

A NativeScript plugin for the simple, intuitive audio framework for iOS.
[EZAudio](https://github.com/syedhali/EZAudio)

* [Install](#install)
* [Usage](#usage)
* [NSEZAudioPlayer](#nsezaudioplayer)
* [UI Components](#ui-components)
* [Screenshots](#screenshots)
* [Try it/Contributing](https://github.com/NathanWalker/nativescript-ezaudio/blob/master/docs/CONTRIBUTING.md)

# Install

```
npm install nativescript-ezaudio --save
```

# Usage

**IMPORTANT:** *Make sure you include `xmlns:ez="nativescript-ezaudio"` on the Page element*

```
// main-page.xml
<Page xmlns="http://schemas.nativescript.org/tns.xsd" 
  xmlns:ez="nativescript-ezaudio"
  loaded="pageLoaded">
  <AbsoluteLayout width="100%" height="100%">
    <ez:AudioPlot 
      class="audioPlot" 
      color="{{audioPlotColor}}" 
      plotType="{{audioPlotType}}" 
      fill="{{audioPlotFill}}" 
      mirror="{{audioPlotMirror}}" 
      bufferData="{{audioPlotBufferData}}" />
    <Button text="{{btnTxt}}" tap="{{toggleCurrentTrack}}" />
  </AbsoluteLayout>
</Page>

// app.css
.audioPlot {
  width:100%;
  height:100%;
  background-color: #000;
  top:0;
  left:0;
}
button {
  font-size: 22;
  horizontal-align: center;
  margin:20px 0;
  color:#FFF803;
  top:20;
  left:0;
  width:100%;
}

// main-page.ts
import {AudioDemo} from "./main-view-model";

function pageLoaded(args) {
  var page = args.object;
  page.bindingContext = new AudioDemo(page);
}
exports.pageLoaded = pageLoaded;

// main-view-model.ts
import {Observable} from 'data/observable';
import {NSEZAudioPlayer} from 'nativescript-ezaudio';

export class AudioDemo extends Observable {
  public btnTxt: string = 'Play Track';
  
  // AudioPlot
  public audioPlotColor: string = '#FFF803';
  public audioPlotType: string = 'buffer';
  public audioPlotFill: boolean = true;
  public audioPlotMirror: boolean = true;
  public audioPlotBufferData: any;
  
  // internal
  private _player: any;
  private _currentTrackIndex: number = 0;
  private _tracks: Array<string> = [
    `any-mp3-you-like.mp3`,
  ];

  constructor(page: any) {
    super();
    this._player = new NSEZAudioPlayer(true);
    this._player.delegate().audioEvents.on('audioBuffer', (eventData) => {
      this.set('audioPlotBufferData', {
        buffer: eventData.data.buffer,
        bufferSize: eventData.data.bufferSize
      });
    });
  }

  public toggleCurrentTrack() {
    this._player.togglePlay(this._tracks[this._currentTrackIndex]);
    this.toggleBtn();  
  }
  
  private toggleBtn() {
    this.set(`btnTxt`, `${this._player.isPlaying() ? 'Stop' : 'Play'} Track`);
  }
}
```

## NSEZAudioPlayer

AudioPlayer based on [EZAudioPlayer](https://github.com/syedhali/EZAudio#EZAudioPlayer).

#### Events

*Coming soon...*

## UI Components

### AudioPlot

Displays an audio waveform and provides attributes to modify it's display.

#### Attributes

*Coming soon...*

#### Events

*Coming soon...*

## Screenshots

*Coming soon...*



