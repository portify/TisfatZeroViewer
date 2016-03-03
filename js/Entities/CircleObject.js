"use strict";

import {TisfatCircle} from "../Util/Drawing.js";
import {Interpolate, InterpolatePointF, InterpolateColor} from "../Util/Interpolation.js";
import {TisfatReadPointF, TisfatReadColor} from "../Util/FileFormat.js";

class CircleObject {
  static read() {
    return new CircleObject();
  }

  draw(ctx, state) {
    TisfatCircle(ctx, state.position, state.radius, state.color);
  }

  interpolate(t, current, target, mode) {
    const state = new CircleObjectState();
    state.position = InterpolatePointF(t, current.position, target.position, mode);
    state.radius = Interpolate(t, current.radius, target.radius, mode);
    state.color = InterpolateColor(t, current.color, target.color, mode);
    return state;
  }
}

class CircleObjectState {
  static read(reader, version) {
    const state = new CircleObjectState();
    state.position = TisfatReadPointF(reader, version);
    state.radius = reader.ReadDouble();
    state.color = TisfatReadColor(reader, version);
    return state;
  }
}
