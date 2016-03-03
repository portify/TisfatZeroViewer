"use strict";

import Layer from "./Layer.js";
import {TisfatReadList, TisfatReadColor} from "../Util/FileFormat.js";

export default class Project {
  constructor() {
    this.layers = [];
    this.animSpeed = 10.0;
    this.fps = 60.0;
    this.width = 460;
    this.height = 360;
    this.backgroundColor = [255, 255, 255, 255];
  }

  static read(reader, version) {
    const project = new Project();
    project.layers = TisfatReadList(reader, version, Layer.read);

    if (version < 6) {
      /* Camera camera = new Camera();
      Layers.Insert(0, camera.CreateDefaultLayer(0, (uint)Program.MainTimeline.GetLastTime(), null)); */
    }

    if (version >= 1) {
      project.animSpeed = reader.ReadDouble();

      if (version >= 5)
        project.fps = reader.ReadDouble();

      if (version >= 2) {
        project.width = reader.ReadInt32();
        project.height = reader.ReadInt32();
        project.backgroundColor = TisfatReadColor(reader, version);
      }
    }

    return project;
  }

  draw(ctx, time) {
    for (let layer of this.layers) {
      layer.draw(ctx, time);
    }
  }

  getEndTime() {
    let endTime = 0;

    for (let layer of this.layers) {
      endTime = Math.max(endTime,
        layer.framesets[layer.framesets.length - 1].getEndTime());
    }

    return endTime;
  }
}
