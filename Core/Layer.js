"use strict";

var Layer = {};

Layer.findFrameset = function(time) {
  for (var i = 0; i < this.framesets.length; i++) {
    var currentSet = this.framesets[i];

    if (time >= currentSet.getStartTime() && time <= currentSet.getEndTime())
      return currentSet;
  };

  return null;
}

Layer.findCurrentState = function(time) {
  if (!this.visible || this.data === null)
    return null;

  var frameset = this.findFrameset(time);

  if (frameset === null)
    return null;

  var nextIndex;

  for (nextIndex = 1; nextIndex < frameset.keyframes.length; nextIndex++) {
    if (frameset.keyframes[nextIndex].time >= time)
      break;
  }

  var current = frameset.keyframes[nextIndex - 1];
  var target = frameset.keyframes[nextIndex];

  var t = (time - current.time) / (target.time - current.time);
  return this.data.interpolate(t, current.state, target.state, current.interpMode);
}

Layer.draw = function(ctx, time) {
  var state = this.findCurrentState(time);

  if (state !== null)
    this.data.draw(ctx, state);
}

var ReadLayer = function(reader, version) {
  var layer = Object.create(Layer);
  layer.name = reader.ReadString();
  layer.visible = reader.ReadBoolean();
  layer.timelineColor = TisfatReadColor(reader, version);
  var func = TisfatResolveEntityID(reader.ReadUInt16());
  layer.data = func(reader, version);
  layer.framesets = TisfatReadList(reader, version, ReadFrameset);

  return layer;
};
