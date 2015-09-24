var Interpolate = function(t, a, b, mode) {
  return a + (b - a) * t;
};

var InterpolatePointF = function(t, a, b, mode) {
  return [Interpolate(t, a[0], b[0], mode), Interpolate(t, a[1], b[1], mode)];
};

var InterpolateColor = function(t, a, b, mode) {
  return [
    Interpolate(t, a[0], b[0], mode),
    Interpolate(t, a[1], b[1], mode),
    Interpolate(t, a[2], b[2], mode),
    Interpolate(t, a[3], b[3], mode)
  ];
};
