var RectObjectState = {};

var ReadRectObjectState = function(reader, version) {
  var state = Object.create(RectObjectState);
  state.position = TisfatReadPointF(reader, version);
  state.extent = TisfatReadPointF(reader, version);
  // state.color = TisfatReadColor(reader, version);
  state.color = [0, 0, 0, 255];
  return state;
};

var RectObject = {};

RectObject.draw = function(ctx, state) {
  ctx.fillStyle = TisfatColorToCSS(state.color);
  ctx.fillRect(state.position[0], state.position[1], state.extent[0], state.extent[1]);
};

RectObject.interpolate = function(t, current, target, mode) {
  var state = Object.create(RectObjectState);
  state.position = InterpolatePointF(t, current.position, target.position, mode);
  state.extent = InterpolatePointF(t, current.extent, target.extent, mode);
  state.color = InterpolateColor(t, current.color, target.color, mode);
  return state;
};

var ReadRectObject = function(reader, version) {
  return Object.create(RectObject);
};
