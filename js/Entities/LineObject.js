"use strict";

import {TisfatCappedLine} from "../Util/Drawing.js";
import {TisfatReadPointF, TisfatReadColor} from "../Util/FileFormat.js";
import {Interpolate, InterpolatePointF, InterpolateColor} from "../Util/Interpolation.js";

export class LineObject {
  static read() {
    return new LineObject();
  }

  draw(ctx, state) {
    TisfatCappedLine(ctx, state.a, state.b, state.thickness, state.color);
  }

  interpolate(t, current, target, mode) {
    const state = new LineObjectState();
    state.a = InterpolatePointF(t, current.a, target.a, mode);
    state.b = InterpolatePointF(t, current.b, target.b, mode);
    state.color = InterpolateColor(t, current.color, target.color, mode);
    state.thickness = Interpolate(t, current.thickness, target.thickness, mode);
    return state;
  }
}

export class LineObjectState {
  static read(reader, version) {
    const state = new LineObjectState();
    state.a = TisfatReadPointF(reader, version);
    state.b = TisfatReadPointF(reader, version);
    state.color = TisfatReadColor(reader, version);
    state.thickness = reader.ReadDouble();
    return state;
  }
}
