"use strict";

import {TisfatReadPointF, TisfatReadColor, TisfatReadList, TisfatReadBitmap} from "../Util/FileFormat.js";
import {TisfatCircle, TisfatCappedLine} from "../Util/Drawing.js";
import {Interpolate, InterpolateColor, InterpolatePointF} from "../Util/Interpolation.js";

export class StickFigureJointState {
  constructor() {
    this.parent = null;
    this.children = [];
    this.location = [0, 0];
    this.jointColor = [255, 0, 0, 0];
    this.thickness = 6;
    this.bitmapIndex = -1;
    this.manipulatable = true;
  }

  static read(reader, version) {
    const state = new StickFigureJointState();
    state.location = TisfatReadPointF(reader, version);
    state.jointColor = TisfatReadColor(reader, version);
    state.thickness = reader.ReadDouble();

    if (version >= 2) {
      state.manipulatable = reader.ReadBoolean();

      if (version >= 4)
        state.bitmapIndex = reader.ReadInt32();
    }

    state.children = TisfatReadList(reader, version, StickFigureJointState.read);

    for (let child of state.children)
      child.parent = state;

    return state;
  }

  static interpolate(t, current, target, mode) {
    const state = new StickFigureJointState();
    state.parent = current.parent;
    state.bitmapIndex = current.bitmapIndex;

    state.location = InterpolatePointF(t, current.location, target.location, mode);
    state.jointColor = InterpolateColor(t, current.jointColor, target.jointColor, mode);
    state.thickness = Interpolate(t, current.thickness, target.thickness, mode);

    for (var i = 0; i < current.children.length; i++) {
      state.children.push(StickFigureJointState.interpolate(t, current.children[i], target.children[i], mode));
    }

    return state;
  }
}

export class StickFigure {
  static read(reader, version) {
    const figure = new StickFigure();
    figure.root = StickFigureJoint.read(reader, version);
    return figure;
  }

  draw(ctx, state) {
    this.root.draw(ctx, state.root);
  }

  interpolate(t, current, target, mode) {
    const state = new StickFigureState();
    state.root = StickFigureJointState.interpolate(t, current.root, target.root, mode);
    return state;
  }
}

export class StickFigureState {
  static read(reader, version) {
    const state = new StickFigureState();
    state.root = StickFigureJointState.read(reader, version);
    return state;
  }
}

export class StickFigureJoint {
  constructor() {
    this.parent = null;
    this.children = [];
    this.jointColor = [255, 0, 0, 0];
    this.handleColor = [255, 0, 0, 255];
    this.thickness = 6;

    // this.bitmaps = [];
    // this.bitmapOffsets = new Map();
    this.initialBitmapIndex = -1;

    this.handleVisible = true;
    this.visible = true;
    this.manipulatable = true;
  }

  static read(reader, version) {
    const joint = new StickFigureJoint();
    joint.parent = null;

    joint.location = TisfatReadPointF(reader, version);
    joint.jointColor = TisfatReadColor(reader, version);
    joint.handleColor = TisfatReadColor(reader, version);
    joint.thickness = reader.ReadDouble();

    if (version >= 2) {
      joint.drawType = reader.ReadString();
      joint.handleVisible = reader.ReadBoolean();
      joint.manipulatable = reader.ReadBoolean();
      joint.visible = reader.ReadBoolean();
    } else {
      joint.drawType = reader.ReadBoolean() ? "CircleLine" : "Normal";
    }

    joint.children = TisfatReadList(reader, version, StickFigureJoint.read);

    for (let child of joint.children)
      child.parent = joint;

    if (version >= 4) {
      const names = TisfatReadList(reader, version, r => r.ReadString());
      const images = TisfatReadList(reader, version, TisfatReadBitmap);
      const rotations = TisfatReadList(reader, version, r => r.ReadDouble());
      const offsets = TisfatReadList(reader, version, TisfatReadPointF);

      // this.bitmaps = [];
      // this.bitmapOffsets = new Map();

      for (let i = 0; i < names.length; i++) {
        // this.bitmaps.append(); // ???
        // ???
      }

      this.initialBitmapIndex = reader.ReadInt32();
    }

    return joint;
  }

  draw(ctx, state) {
    if (this.children.count != state.children.count)
      throw new Error("state does not match this joint");

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].drawTo(ctx, state.children[i], this, state);
      this.children[i].draw(ctx, state.children[i]);
    }
  }

  drawTo(ctx, state, otherJoint, otherState) {
    if (!this.visible)
      return;

    switch (this.drawType) {
    case "CircleLine":
      const dx = state.location[0] - otherState.location[0];
      const dy = state.location[1] - otherState.location[1];
      const r = Math.sqrt(dx * dx + dy * dy) / 2;

      const x = otherState.location[0] + dx / 2;
      const y = otherState.location[1] + dy / 2;

      TisfatCircle(ctx, [x, y], r, state.jointColor);
      break;
    case "CircleRadius":
      TisfatCircle(ctx, state.location, state.thickness, state.jointColor);
      break;
    case "Normal":
      TisfatCappedLine(ctx, state.location, otherState.location, state.thickness, state.jointColor);
      break;
    default:
      throw new Error(`unknown joint drawing type ${this.drawType}`);
    }
  }
}
