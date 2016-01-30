"use strict";

function NativeEZAudio() {
  if (!this instanceof NativeEZAudio) { // jshint ignore:line
    //noinspection JSValidateTypes
    return new NativeEZAudio();
  }
}

NativeEZAudio.prototype.playAudioFile = function(player, filePath) {
  var audioFile = EZAudioFile.audioFileWithURL(NSURL.fileURLWithPath(filePath));
  player.playAudioFile(audioFile);
};

module.exports = NativeEZAudio;