"use strict";

import {TisfatReadPointF} from "../Util/FileFormat.js";
import {Interpolate, InterpolatePointF} from "../Util/Interpolation.js";

export class CameraState {
  static read(reader, version) {
    const state = new CameraState();
    state.location = TisfatReadPointF(reader, version);
    state.scale = reader.ReadDouble();
    state.angle = reader.ReadDouble();
    return state;
  }
}

export class Camera {
  static read() {
    return new Camera();
  }

  interpolate(t, current, target, mode) {
    const state = new CameraState();
    state.location = InterpolatePointF(t, current.location, target.location, mode);
    state.angle = Interpolate(t, current.angle, target.angle, mode);
    state.scale = Interpolate(t, current.scale, target.scale, mode);
    return state;
  }

  draw() { /* stub */ }

  transform(ctx, state) {
    const [x, y] = state.location;
    const inv = 1 / state.scale;
    // ctx.translate(-x * 1 / state.scale, -y * 1 / state.scale);
    ctx.translate(-x / state.scale, -y / state.scale);
    ctx.scale(inv, inv);
    ctx.rotate(state.angle);
  }

  createRefState() {
    const state = new CameraState();
    state.location = [0, 0];
    state.scale = 1;
    state.angle = 0;
    return state;
  }
}
