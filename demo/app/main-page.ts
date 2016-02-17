var frameModule = require("ui/frame");
import view = require("ui/core/view");
import {AudioPlayerDemo} from "./main-view-model";

  var audioPlayer = new AudioPlayerDemo();


function pageLoaded(args) {
  var page = args.object;
  page.bindingContext = audioPlayer;
  
  var controller = frameModule.topmost().ios.controller;
  var navigationBar = controller.navigationBar;
  navigationBar.barStyle = 1;
}
exports.pageLoaded = pageLoaded;

exports.createAudioPlot = audioPlayer.createAudioPlot.bind(audioPlayer);