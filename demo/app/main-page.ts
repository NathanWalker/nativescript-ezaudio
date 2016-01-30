import {AudioPlayerTest} from "./main-view-model";
function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = new AudioPlayerTest();
}
exports.pageLoaded = pageLoaded;
