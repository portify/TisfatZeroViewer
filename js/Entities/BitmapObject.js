"use strict";

import {TisfatReadBitmap, TisfatReadPointF} from "../Util/FileFormat.js";
import {Interpolate, InterpolatePointF} from "../Util/Interpolation.js";

export class BitmapObject {
  static read(reader, version) {
    const object = new BitmapObject();
    object.bitmap = TisfatReadBitmap(reader, version);
    return object;
  }

  interpolate(t, current, target, mode) {
    const state = new BitmapObjectState();
    state.location = InterpolatePointF(t, current.location, target.location, mode);
    state.size = InterpolatePointF(t, current.size, target.size, mode);
    state.rotation = Interpolate(t, current.rotation, target.rotation, mode);
    state.alpha = Interpolate(t, current.alpha, target.alpha, mode);
    return state;
  }

  draw(ctx, state) {
    const [x, y] = state.location;
    const [width, height] = state.size;
    // TODO: alpha and rotation
    ctx.drawImage(this.bitmap, x, y, width, height);
  }
}

export class BitmapObjectState {
  static read(reader, version) {
    const state = new BitmapObjectState();
    state.location = TisfatReadPointF(reader, version);
    state.size = TisfatReadPointF(reader, version);
    const width = reader.ReadDouble();
    const height = reader.ReadDouble();
    state.rotation = reader.ReadDouble();

    if (version >= 5)
      state.alpha = reader.ReadInt32();
    else
      state.alpha = 255;

    return state;
  }
}
