"use strict";

import Layer from "./Layer.js";
import Frameset from "./Frameset.js";
import Keyframe from "./Keyframe.js";
import {Camera} from "../Entities/Camera.js";
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
    console.log(project.layers.map(l => l.name));

    if (version < 6) {
      project.layers.unshift(project.createCameraLayer());
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

  createCameraLayer() {
    const camera = new Camera();
    const layer = new Layer();
    const frameset = new Frameset();

    layer.name = "Camera";
    layer.timelineColor = [255, 70, 120, 255];
    layer.data = camera;

    frameset.keyframes.push(new Keyframe(0, camera.createRefState()));
    frameset.keyframes.push(new Keyframe(this.getEndTime(), camera.createRefState()));
    layer.framesets.push(frameset);

    return layer;
  }
}
