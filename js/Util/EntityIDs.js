"use strict";

import {StickFigure, StickFigureState} from "../Entities/StickFigure.js";

var TisfatEntityTypes = {
  /* "0": ReadStickFigure,
  "3": ReadLineObject,
  "4": ReadRectObject,
  "5": ReadCircleObject */

  "0": StickFigure
};

var TisfatEntityStateTypes = {
  /* "0": ReadStickFigureState,
  "3": ReadLineObjectState,
  "4": ReadRectObjectState,
  "5": ReadCircleObjectState */

  "0": StickFigureState
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
