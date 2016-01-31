var ezaudio = {};

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