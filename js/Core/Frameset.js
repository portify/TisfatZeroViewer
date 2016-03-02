"use strict";

import Keyframe from "./Keyframe.js";
import {TisfatReadList} from "../Util/FileFormat.js";

export default class Frameset {
  constructor() {
    this.keyframes = [];
  }

  static read(reader, version) {
    const frameset = new Frameset();
    frameset.keyframes = TisfatReadList(reader, version, Keyframe.read);
    return frameset;
  }

  getStartTime() {
    return this.keyframes[0].time;
  }

  getEndTime() {
    return this.keyframes[this.keyframes.length - 1].time;
  }
}
