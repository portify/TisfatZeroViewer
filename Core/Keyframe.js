"use strict";

var Keyframe = {};

var ReadKeyframe = function(reader, version) {
  var keyframe = Object.create(Keyframe);
  keyframe.time = reader.ReadUInt32();
  var func = TisfatResolveEntityStateID(reader.ReadUInt16());
  keyframe.interpMode = version >= 2 ? reader.ReadString() : "Linear";
  keyframe.state = func(reader, version);
  return keyframe;
};
