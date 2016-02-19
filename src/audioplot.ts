import {View} from "ui/core/view";
import {ContentView} from "ui/content-view";
import {PropertyMetadata} from "ui/core/proxy";
import {Property, PropertyMetadataSettings, PropertyChangeData} from "ui/core/dependency-observable";
import {Color} from "color";
import {AudioPlotBase} from "./audioplotbase";

function colorChange(eventData: PropertyChangeData) {
  var audioPlot = <AudioPlot>eventData.object;
  audioPlot.color = eventData.newValue;
}

var colorProp = new Property(
  "color",
  "AudioPlot",
  new PropertyMetadata('', PropertyMetadataSettings.None, colorChange)
);

function fillChange(eventData: PropertyChangeData) {
  var audioPlot = <AudioPlot>eventData.object;
  audioPlot.fill = eventData.newValue;
}

var fillProp = new Property(
  "fill",
  "AudioPlot",
  new PropertyMetadata('', PropertyMetadataSettings.None, fillChange)
);

function mirrorChange(eventData: PropertyChangeData) {
  var audioPlot = <AudioPlot>eventData.object;
  audioPlot.mirror = eventData.newValue;
}

var mirrorProp = new Property(
  "mirror",
  "AudioPlot",
  new PropertyMetadata('', PropertyMetadataSettings.None, mirrorChange)
);

function plotTypeChange(eventData: PropertyChangeData) {
  var audioPlot = <AudioPlot>eventData.object;
  audioPlot.plotType = eventData.newValue;
}

var plotTypeProp = new Property(
  "plotType",
  "AudioPlot",
  new PropertyMetadata('', PropertyMetadataSettings.None, plotTypeChange)
);

function bufferDataChange(eventData: PropertyChangeData) {
  var audioPlot = <AudioPlot>eventData.object;
  audioPlot.bufferData = eventData.newValue;
}

var bufferDataProp = new Property(
  "bufferData",
  "AudioPlot",
  new PropertyMetadata('', PropertyMetadataSettings.None, bufferDataChange)
);

export class AudioPlot extends ContentView implements AudioPlotBase {
  public static colorProp = colorProp;
  public static fillProp = fillProp;
  public static mirrorProp = mirrorProp;
  public static plotTypeProp = plotTypeProp;
  public static bufferDataProp = bufferDataProp;
  private _ios: EZAudioPlot;
  
  constructor() {
    super();
    // console.log('--------- AudioPlot ---------');
    this._ios = EZAudioPlot.alloc().initWithFrame(CGRectMake(0, 0, 0, 0));
  }
  
  get android(): any {
    return;
  }

  get ios(): EZAudioPlot {
    return this._ios;
  }

  get _nativeView(): EZAudioPlot {
    return this._ios;
  }
  
  get color(): string {
    return this._getValue(AudioPlot.colorProp);
  }
  
  set color(value: string) {
    // console.log(`AudioPlot color: ${value}`);
    this._ios.color = new Color(value).ios;
    this._setValue(AudioPlot.colorProp, value);
  }
  
  get fill(): boolean {
    return this._getValue(AudioPlot.fillProp);
  }
  
  set fill(value: boolean) {
    // console.log(`AudioPlot fill: ${value}`);
    this._ios.shouldFill = value;
    this._setValue(AudioPlot.fillProp, value);
  }
  
  get mirror(): boolean {
    return this._getValue(AudioPlot.mirrorProp);
  }
  
  set mirror(value: boolean) {
    // console.log(`AudioPlot mirror: ${value}`);
    this._ios.shouldMirror = value;
    this._setValue(AudioPlot.mirrorProp, value);
  }
  
  get plotType(): string {
    return this._getValue(AudioPlot.plotTypeProp);
  }
  
  set plotType(type: string) {
    // console.log(`AudioPlot plotType: ${type}`);
    switch (type) {
      case 'buffer':
        this._ios.plotType = EZPlotTypeBuffer;
        break;
      case 'rolling':
        this._ios.plotType = EZPlotTypeRolling;
        break;
    }
    this._setValue(AudioPlot.plotTypeProp, type);
  }
  
  get bufferData(): any {
    return this._getValue(AudioPlot.bufferDataProp);
  }
  
  set bufferData(data: any) {
    this._ios.updateBufferWithBufferSize(data.buffer, data.bufferSize);
    this._setValue(AudioPlot.bufferDataProp, data);
  }
  
  public _addChildFromBuilder(name: string, value: any) {
    if (value instanceof View) {
      this.addChild(value);
    }
  }
}