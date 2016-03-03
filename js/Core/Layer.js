"use strict";

import {TisfatReadColor, TisfatReadList} from "../Util/FileFormat.js";
import {TisfatResolveEntityID} from "../Util/EntityIDs.js";
import Frameset from "./Frameset.js";

export default class Layer {
  constructor() {
    this.name = "Layer";
    this.visible = true;
    this.timelineColor = "aliceblue";
    this.framesets = [];
    this.depth = 0;
  }

  static read(reader, version) {
    const layer = new Layer();
    layer.name = reader.ReadString();
    layer.visible = reader.ReadBoolean();
    layer.timelineColor = TisfatReadColor(reader, version);
    const type = TisfatResolveEntityID(reader.ReadUInt16());
    layer.data = type.read(reader, version);
    layer.framesets = TisfatReadList(reader, version, Frameset.read);

    return layer;
  }

  findFrameset(time) {
    for (let frameset of this.framesets) {
      if (time >= frameset.getStartTime() && time <= frameset.getEndTime())
        return frameset;
    }

    return null;
  }

  findCurrentState(time) {
    if (!this.visible || this.data === null)
      return null;

    const frameset = this.findFrameset(time);

    if (frameset === null)
      return null;

    let nextIndex;

    for (nextIndex = 1; nextIndex < frameset.keyframes.length; nextIndex++) {
      if (frameset.keyframes[nextIndex].time >= time)
        break;
    }

    const current = frameset.keyframes[nextIndex - 1];
    const target = frameset.keyframes[nextIndex];

    const t = (time - current.time) / (target.time - current.time);
    return this.data.interpolate(t, current.state, target.state, current.interpMode);
  }

  draw(ctx, time) {
    const state = this.findCurrentState(time);

    if (state !== null)
      this.data.draw(ctx, state);
  }
}
