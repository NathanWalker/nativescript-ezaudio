var ezaudio = {};

// This is temporary
// TODO: move all details from demo/app/main-view-model.ts
// to here so using the plugin will be easier
var EZNotificationObserver = NSObject.extend({
  _onReceiveCallback: function(notification) {},
  new: function () {
    var self = this.super.new(); 
    return self;
  },
  initWithCallback(onReceiveCallback) {
    this._onReceiveCallback = onReceiveCallback;
    return this;
  },
  onReceive(notification) {
    this._onReceiveCallback(notification);
  }
},
  {
    exposedMethods: {
      onReceive: {
        returns: interop.types.void, params: [NSNotification]
      }
    }
  });

ezaudio.playAudioFile = function(player, file) {
  var fileParts = file.split('.');
  var filePath = fileParts[0];
  var fileExt = fileParts[1];
  var soundPath = NSBundle.mainBundle().pathForResourceOfType(filePath, fileExt);
  var url = NSURL.fileURLWithPath(soundPath);
  var audioFile = EZAudioFile.audioFileWithURL(url);
  player.playAudioFile(audioFile);
};

module.exports = ezaudio;