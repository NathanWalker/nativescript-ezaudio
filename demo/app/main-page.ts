import {AudioPlayerDemo} from "./main-view-model";
function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = new AudioPlayerDemo();
}
exports.pageLoaded = pageLoaded;
