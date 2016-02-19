var frameModule = require("ui/frame");
import {AudioPlayerDemo} from "./player-view-model";

function pageLoaded(args) {
  var page = args.object;
  page.bindingContext = new AudioPlayerDemo(page);
  
  var controller = frameModule.topmost().ios.controller;
  var navigationBar = controller.navigationBar;
  navigationBar.barStyle = 1;
}
exports.pageLoaded = pageLoaded;