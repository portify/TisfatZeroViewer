var CircleObjectState = {};

var ReadCircleObjectState = function(reader, version) {
  var state = Object.create(CircleObjectState);
  state.position = TisfatReadPointF(reader, version);
  state.radius = reader.ReadDouble();
  state.color = TisfatReadColor(reader, version);
  return state;
};

var CircleObject = {};

CircleObject.draw = function(ctx, state) {
  TisfatCircle(ctx, state.position, state.radius, state.color);
};

CircleObject.interpolate = function(t, current, target, mode) {
  var state = Object.create(CircleObjectState);
  state.position = InterpolatePointF(t, current.position, target.position, mode);
  state.radius = Interpolate(t, current.radius, target.radius, mode);
  state.color = InterpolateColor(t, current.color, target.color, mode);
  return state;
};

var ReadCircleObject = function(reader, version) {
  return Object.create(CircleObject);
};
