var frameModule = require("ui/frame");
import view = require("ui/core/view");
import {AudioPlayerDemo} from "./main-view-model";

function pageLoaded(args) {
  var page = args.object;
  var audioPlayer = new AudioPlayerDemo();
  page.bindingContext = audioPlayer;
  
  var controller = frameModule.topmost().ios.controller;
  var navigationBar = controller.navigationBar;
  navigationBar.barStyle = 1;
}
exports.pageLoaded = pageLoaded;
