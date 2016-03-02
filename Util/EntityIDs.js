"use strict";

var TisfatEntityTypes = {
  "0": ReadStickFigure,
  "1": ReadBitmapObject,
  "2": ReadPointLight,
  "3": ReadLineObject,
  "4": ReadRectObject,
  "5": ReadCircleObject,
  "6": ReadPolyObject,
  "7": ReadTextObject,
  "8": ReadCustomFigure,
  "9": ReadCamera
};

var TisfatEntityStateTypes = {
  "0": ReadStickFigureState,
  "1": ReadBitmapObjectState,
  "2": ReadPointLightState,
  "3": ReadLineObjectState,
  "4": ReadRectObjectState,
  "5": ReadCircleObjectState,
  "6": ReadPolyObjectState,
  "7": ReadTextObjectState,
  "8": ReadCustomFigureState,
  "9": ReadCameraState
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
