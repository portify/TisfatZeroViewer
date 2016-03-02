"use strict";

import {TisfatResolveEntityStateID} from "../Util/EntityIDs.js";

export default class Keyframe {
  constructor() {
    this.time = 0;
    this.state = null;
    this.interpMode = "Linear";
  }

  static read(reader, version) {
    const keyframe = new Keyframe();
    keyframe.time = reader.ReadUInt32();
    const type = TisfatResolveEntityStateID(reader.ReadUInt16());
    keyframe.interpMode = version >= 2 ? reader.ReadString() : "Linear";
    keyframe.state = type.read(reader, version);
    return keyframe;
  }
}
