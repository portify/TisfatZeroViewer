StickFigure.interpolate = function(t, current, target, mode) {
  var state = Object.create(StickFigureJointState);
  state.root = StickFigureJointState.interpolate(t, current.root, target.root, mode);
  return state;
};

export class StickFigure {
  static read(reader, version) {
    const figure = new StickFigure();
    figure.root = StickFigureJoint.read(reader, version);
    return figure;
  }

  draw(ctx, state) {
    this.root.draw(ctx, state.root);
  }

  interpolate(t, current, target, mode) {
    const state = new StickFigureState();
    state.root = StickFigureJointState.Interpolate(t, current.root, target.root, mode);
    return state;
  }
}

export class StickFigureState {
  static read(reader, version) {
    const state = new StickFigureState();
    state.root = StickFigureJointState.read(reader, version);
    return state;
  }
}








var StickFigureJointState = {};

StickFigureJointState.interpolate = function(t, current, target, mode) {
  var state = Object.create(StickFigureJointState);
  state.parent = this.parent;
  state.location = InterpolatePointF(t, current.location, target.location, mode);
  state.jointColor = InterpolateColor(t, current.jointColor, target.jointColor, mode);
  state.thickness = Interpolate(t, current.thickness, target.thickness, mode);
  state.children = [];

  for (var i = 0; i < current.children.length; i++) {
    state.children.push(StickFigureJointState.interpolate(t, current.children[i], target.children[i], mode));
  }

  return state;
};

var ReadStickFigureJointState = function(reader, version) {
  var state = Object.create(StickFigureJointState);
  state.location = TisfatReadPointF(reader, version);
  state.jointColor = TisfatReadColor(reader, version);
  state.thickness = reader.ReadDouble();
  state.manipulatable = version >= 2 ? reader.ReadBoolean() : true;
  state.children = TisfatReadList(reader, version, ReadStickFigureJointState);

  for (var i = 0; i < state.children.length; i++)
    state.children[i].parent = state;

  return state;
};

var StickFigureJoint = {};

StickFigureJoint.draw = function(ctx, state) {
  if (this.children.count != state.children.count)
    throw new Error("state does not match this joint");

  for (var i = 0; i < this.children.length; i++) {
    this.children[i].drawTo(ctx, state.children[i], this, state);
    this.children[i].draw(ctx, state.children[i]);
  }
};

StickFigureJoint.drawTo = function(ctx, state, otherJoint, otherState) {
  if (!this.visible)
    return;

  if (this.drawType == "CircleLine") {
    var dx = state.location[0] - otherState.location[0];
    var dy = state.location[1] - otherState.location[1];
    var r = Math.sqrt(dx * dx + dy * dy) / 2;

    var x = otherState.location[0] + dx / 2;
    var y = otherState.location[1] + dy / 2;

    TisfatCircle(ctx, [x, y], r, state.jointColor);
  }
  else if (this.drawType == "CircleRadius") {
    TisfatCircle(ctx, state.location, state.thickness, state.jointColor);
  }
  else if (this.drawType == "Normal") {
    TisfatCappedLine(ctx, state.location, otherState.location, state.thickness, state.jointColor);
  }
};

var ReadStickFigureJoint = function(reader, version) {
  var joint = Object.create(StickFigureJoint);
  joint.parent = null;

  joint.location = TisfatReadPointF(reader, version);
  joint.jointColor = TisfatReadColor(reader, version);
  joint.handleColor = TisfatReadColor(reader, version);
  joint.thickness = reader.ReadDouble();

  if (version >= 2) {
    joint.drawType = reader.ReadString();
    joint.handleVisible = reader.ReadBoolean();
    joint.manipulatable = reader.ReadBoolean();
    joint.visible = reader.ReadBoolean();
  }
  else {
    joint.drawType = reader.ReadBoolean() ? "CircleLine" : "Normal";
    joint.handleVisible = true;
    joint.manipulatable = true;
    joint.visible = true;
  }

  joint.children = TisfatReadList(reader, version, ReadStickFigureJoint);

  for (var i = 0; i < joint.children.length; i++)
    joint.children[i].parent = joint;

  return joint;
};

var StickFigureState = {};

var ReadStickFigureState = function(reader, version) {
  var state = Object.create(StickFigureState);
  state.root = ReadStickFigureJointState(reader, version);
  return state;
};
