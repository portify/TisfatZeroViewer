var LineObjectState = {};

var ReadLineObjectState = function(reader, version) {
  var state = Object.create(LineObjectState);
  state.a = TisfatReadPointF(reader, version);
  state.b = TisfatReadPointF(reader, version);
  state.color = TisfatReadColor(reader, version);
  state.thickness = reader.ReadDouble();
  return state;
};

var LineObject = {};

LineObject.draw = function(ctx, state) {
  TisfatCappedLine(ctx, state.a, state.b, state.thickness, state.color);
};

LineObject.interpolate = function(t, current, target, mode) {
  var state = Object.create(LineObjectState);
  state.a = InterpolatePointF(t, current.a, target.a, mode);
  state.b = InterpolatePointF(t, current.b, target.b, mode);
  state.color = InterpolateColor(t, current.color, target.color, mode);
  state.thickness = Interpolate(t, current.thickness, target.thickness, mode);
  return state;
};

var ReadLineObject = function(reader, version) {
  return Object.create(LineObject);
};
