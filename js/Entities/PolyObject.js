"use strict";

import {TisfatColorToCSS, TisfatReadList, TisfatReadPointF, TisfatReadColor} from "../Util/FileFormat.js";
import {InterpolateColor, InterpolatePointF} from "../Util/Interpolation.js";

export class PolyObject {
  static read(reader, version) {
    return new PolyObject();
  }

  interpolate(t, current, target, mode) {
    const state = new PolyObjectState();
    state.color = InterpolateColor(t, current.color, target.color, mode);

    for (let i = 0; i < current.points.length; i++) {
      const joint = new PolyObjectJoint();
      joint.location = InterpolatePointF(t, current.points[i].location, target.points[i].location, mode);
      state.points.append(joint);
    }

    return state;
  }

  draw(ctx, state) {
    ctx.fillStyle = TisfatColorToCSS(state.color);
    ctx.beginPath();
    let isFirst = true;
    for (let {location} of state.points) {
      if (isFirst) {
        ctx.moveTo(location);
        isFirst = false;
      } else {
        ctx.lineTo(location);
      }
    }
    ctx.closePath();
    ctx.fill();
  }
}

export class PolyObjectJoint {
  static read(reader, version) {
    this.location = TisfatReadPointF(reader, version);
  }
}

export class PolyObjectState {
  static read(reader, version) {
    const state = new PolyObjectState();
    state.points = TisfatReadList(reader, version, PolyObjectJoint.read);
    state.color = TisfatReadColor(reader, version);
    return state;
  }
}
