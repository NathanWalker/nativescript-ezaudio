var ezaudio = {};

ezaudio.playAudioFile = function(player, filePath) {
  // EZAudioUtilities.checkResultExtAudioFileOpenURLOperation(filePath, 'Failed to create ExtAudioFileRef');
  var audioFile = EZAudioFile.audioFileWithURL(NSURL.fileURLWithPath(filePath));
  player.playAudioFile(audioFile);
};

module.exports = ezaudio;