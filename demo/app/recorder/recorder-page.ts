var frameModule = require("ui/frame");
import {AudioRecorderDemo} from "./recorder-view-model";
function pageLoaded(args) {
  var page = args.object;
  page.bindingContext = new AudioRecorderDemo();
  
  var controller = frameModule.topmost().ios.controller;
  var navigationBar = controller.navigationBar;
  navigationBar.barStyle = 1;
}
exports.pageLoaded = pageLoaded;
