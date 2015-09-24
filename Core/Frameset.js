var Frameset = {};

Frameset.getStartTime = function() {
  return this.keyframes[0].time;
};

Frameset.getEndTime = function() {
  return this.keyframes[this.keyframes.length - 1].time;
};

var ReadFrameset = function(reader, version) {
  var frameset = Object.create(Frameset);
  frameset.keyframes = TisfatReadList(reader, version, ReadKeyframe);
  return frameset;
};
