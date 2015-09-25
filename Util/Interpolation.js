var Interpolate = function(t, a, b, mode) {
  switch (mode) {
  case "None": return t < 1 ? a : b;
  case "Linear": return a + (b - a) * t;
  case "QuadInOut":
    b -= a;
    t *= 2;

    if (t < 1) return b / 2 * t * t + a;
    t--;
    return -b / 2 * (t * (t - 2) - 1) + a;
  case "ExpoInOut":
    b -= a;
    t *= 2;

    if (t < 1) return b / 2 * Math.pow(2, 10 * (t - 1)) + a;
    t--;
    return b / 2 * (-Math.pow(2, -10 * t) + 2) + a;
  case "BounceOut":
    b -= a;

    if (t < 1 / 2.75)
    {
      return b * (7.5625 * t * t) + a;
    }
    else if (t < 2 / 2.75)
    {
      t -= 1.5 / 2.75;
      return b * (7.5625 * t * t + 0.75) + a;
    }
    else if (t < 2.5 / 2.75)
    {
      t -= 2.25 / 2.75;
      return b * (7.5625 * t * t + 0.9375) + a;
    }
    else
    {
      t -= 2.625 / 2.75;
      return b * (7.5625 * t * t + 0.984375) + a;
    }
  case "BackOut":
    b -= a;
    // ew
    return b * ((t = t - 1) * t * ((1.70158 + 1) * t + 1.70158) + 1) + a;
  default:
    throw new Error("unknown interpMode " + mode);
  }
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
