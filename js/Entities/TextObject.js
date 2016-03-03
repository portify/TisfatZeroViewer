"use strict";

import {TisfatColorToCSS, TisfatReadPointF} from "../Util/FileFormat.js";
import {InterpolateColor, InterpolatePointF} from "../Util/Interpolation.js";

// TODO: handle .NET FontStyle [Flags] enum
// FlagsAttribute causes the enum string to be a list separated by ", "
const FontStyleMap = {
  "Bold": "bold",
  "Italic": "italic",
  "Regular": "normal",
  /* "Strikeout": "strikeout",
  "Underline": "underline" */
};

const TextAlignmentMap = {
  "Center": "center",
  "Far": "end",
  "Near": "start"
};

const TextBaselineMap = {
  "Center": "middle",
  "Far": "bottom",
  "Near": "top"
};

export class TextObject {
  static read() {
    return new TextObject();
  }

  draw(ctx, state) {
    ctx.font = state.textFont;
    ctx.fillStyle = TisfatColorToCSS(state.textColor);
    ctx.textAlign = TextAlignmentMap[state.textAlignment];
    ctx.textBaseline = "top";
    // TODO: take into account state.size!
    ctx.fillText(state.text, state.location, state.location);
  }

  interpolate(t, current, target, mode) {
    const state = new TextObjectState();

    state.location = InterpolatePointF(t, current.location, target.location, mode);
    state.size = InterpolatePointF(t, current.size, target.size, mode);

    state.text = current.text;
    state.textAlignment = current.textAlignment;
    state.textFont = current.textFont;
    state.textColor = InterpolateColor(t, current.textColor, target.textColor, mode);

    return state;
  }
}

export class TextObjectState {
  static read(reader, version) {
    const state = new TextObjectState();
    state.location = TisfatReadPointF(reader, version);
    state.size = TisfatReadPointF(reader, version);
    state.text = reader.ReadString();
    const fontName = reader.ReadString();
    const fontSize = reader.ReadDouble();
    const fontStyle = reader.ReadString(); // ReadInt32
    state.textFont = `${FontStyleMap[fontStyle]} ${fontSize}px ${fontName}`;
    return state;
  }
}
