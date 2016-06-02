import {ContentView} from "ui/content-view";
import {Color} from "color";

declare var EZAudioPlot: any, CGRectMake: any, EZPlotTypeBuffer: any, EZPlotTypeRolling: any;

export class AudioPlot extends ContentView {
  private _color: string;
  private _fill: boolean;
  private _mirror: boolean;
  private _plotType: any;
  private _ios: any;
  
  constructor() {
    super();
    console.log('--------- AudioPlot ---------');
    this._ios = EZAudioPlot.alloc().initWithFrame(CGRectMake(0, 0, 0, 0));
  }

  get _nativeView(): any {
    return this._ios;
  }
  
  set plotColor(value: string) {
    this._color = value;
    // console.log(`AudioPlot color: ${value}`);
    this._ios.color = new Color(value).ios;
  }
  
  set fill(value: boolean) {
    this._fill = value;
    // console.log(`AudioPlot fill: ${value}`);
    this._ios.shouldFill = value;
  }
  
  set mirror(value: boolean) {
    this._mirror = value;
    // console.log(`AudioPlot mirror: ${value}`);
    this._ios.shouldMirror = value;
  }
  
  set plotType(type: string) {
    this._plotType = type;
    // console.log(`AudioPlot plotType: ${type}`);
    switch (type) {
      case 'buffer':
        this._ios.plotType = EZPlotTypeBuffer;
        break;
      case 'rolling':
        this._ios.plotType = EZPlotTypeRolling;
        break;
    }
  }
  
  set bufferData(data: any) {
    this._ios.updateBufferWithBufferSize(data.buffer, data.bufferSize);
  }
}