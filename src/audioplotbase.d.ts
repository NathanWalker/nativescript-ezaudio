/**
 * Contains the AudioPlot class, which represents an Audio Waveform.
 */
declare module "audioplotbase" {
  import {View, AddChildFromBuilder} from "ui/core/view";
     
  /**
   * Represents a standard AudioPlot component.
   */
  export class AudioPlotBase extends View implements AddChildFromBuilder {
       
    /**
     * Gets the native [android widget](TODO) that represents the user interface for this component.
     */
    android: any; /* TODO */
     
    /**
    * Gets the native [ios widget](https://github.com/syedhali/EZAudio#EZAudioPlot) that represents the user interface for this component.
    */
    ios: any; /* EZAudioPlot */

    /**
    * Called for every child element declared in xml.
    * This method will add a child element (value) to current element.
    * @param name - Name of the element.
    * @param value - Value of the element.
    */
    _addChildFromBuilder(name: string, value: any): void;
  }
}