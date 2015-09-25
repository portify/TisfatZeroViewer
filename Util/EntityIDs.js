"use strict";

var TisfatEntityTypes = {
  "0": ReadStickFigure,
  "3": ReadLineObject,
  "4": ReadRectObject
};

var TisfatEntityStateTypes = {
  "0": ReadStickFigureState,
  "3": ReadLineObjectState,
  "4": ReadRectObjectState
};

var TisfatResolveEntityID = function(id) {
  if (TisfatEntityTypes[id])
    return TisfatEntityTypes[id];

  throw new Error("cannot resolve entity id " + id);
};

var TisfatResolveEntityStateID = function(id) {
  if (TisfatEntityStateTypes[id])
    return TisfatEntityStateTypes[id];

  throw new Error("cannot resolve entity state id " + id);
};
