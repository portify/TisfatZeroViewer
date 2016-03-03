"use strict";

import {StickFigure, StickFigureState} from "../Entities/StickFigure.js";
// import {BitmapObject, BitmapObjectState} from "../Entities/BitmapObject.js";
// import {PointLight, PointLightState} from "../Entities/PointLight.js";
import {LineObject, LineObjectState} from "../Entities/LineObject.js";
import {RectObject, RectObjectState} from "../Entities/RectObject.js";
import {CircleObject, CircleObjectState} from "../Entities/CircleObject.js";
import {PolyObject, PolyObjectState} from "../Entities/PolyObject.js";
import {TextObject, TextObjectState} from "../Entities/TextObject.js";
// import {CustomFigure, CustomFigureState} from "../Entities/CustomFigure.js";
import {Camera, CameraState} from "../Entities/Camera.js";

const TisfatEntityTypes = {
  "0": StickFigure,
  // "1": BitmapObject,
  // "2": PointLight,
  "3": LineObject,
  "4": RectObject,
  "5": CircleObject,
  "6": PolyObject,
  "7": TextObject,
  // "8": CustomFigure,
  "9": Camera
};

const TisfatEntityStateTypes = {
  "0": StickFigureState,
  // "1": BitmapObjectState,
  // "2": PointLightState,
  "3": LineObjectState,
  "4": RectObjectState,
  "5": CircleObjectState,
  "6": PolyObjectState,
  "7": TextObjectState,
  // "8": CustomFigureState,
  "9": CameraState
};

export function TisfatResolveEntityID(id) {
  if (TisfatEntityTypes[id])
    return TisfatEntityTypes[id];

  throw new Error("cannot resolve entity id " + id);
}

export function TisfatResolveEntityStateID(id) {
  if (TisfatEntityStateTypes[id])
    return TisfatEntityStateTypes[id];

  throw new Error("cannot resolve entity state id " + id);
}
