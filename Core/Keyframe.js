var TisfatEntityStateTypes = {
  "0": ReadStickFigureState
};

var TisfatResolveEntityStateID = function(id) {
  if (TisfatEntityStateTypes[id])
    return TisfatEntityStateTypes[id];

  throw new Error("cannot resolve entity state id " + id);
};

var Keyframe = {};

var ReadKeyframe = function(reader, version) {
  var keyframe = Object.create(Keyframe);
  keyframe.time = reader.ReadUInt32();
  var func = TisfatResolveEntityStateID(reader.ReadUInt16());
  keyframe.interpMode = version >= 2 ? reader.ReadString() : "Linear";
  keyframe.state = func(reader, version);
  return keyframe;
};
