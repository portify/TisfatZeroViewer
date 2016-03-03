"use strict";

import {TisfatColorToCSS, TisfatReadPointF, TisfatReadColor} from "../Util/FileFormat.js";
import {InterpolatePointF, InterpolateColor} from "../Util/Interpolation.js";

export class RectObject {
  static read() {
    return new RectObject();
  }

  draw(ctx, state) {
    ctx.fillStyle = TisfatColorToCSS(state.color);
    ctx.fillRect(state.position[0], state.position[1], state.extent[0], state.extent[1]);
  }

  interpolate(t, current, target, mode) {
    const state = new RectObjectState();
    state.position = InterpolatePointF(t, current.position, target.position, mode);
    state.extent = InterpolatePointF(t, current.extent, target.extent, mode);
    state.color = InterpolateColor(t, current.color, target.color, mode);
    return state;
  }
}

export class RectObjectState {
  static read(reader, version) {
    const state = new RectObjectState();
    state.position = TisfatReadPointF(reader, version);
    state.extent = TisfatReadPointF(reader, version);
    state.color = version >= 3 ? TisfatReadColor(reader, version) : [255, 0, 0, 0];
    return state;
  }
}
