"use strict";

var Project = {};

Project.draw = function(ctx, time) {
  for (var i = 0; i < this.layers.length; i++) {
    var layer = this.layers[i];
    layer.draw(ctx, time);
  }
};

Project.getEndTime = function() {
  var endTime = 0;

  for (var i = 0; i < this.layers.length; i++) {
    var layer = this.layers[i];
    endTime = Math.max(endTime, layer.framesets[layer.framesets.length - 1].getEndTime());
  }

  return endTime;
}

var ReadProject = function(reader, version) {
  var project = Object.create(Project);
  project.layers = TisfatReadList(reader, version, ReadLayer);
  project.fps = 10.0;
  project.width = 460;
  project.height = 360;
  project.backgroundColor = "white";

  if (version >= 1) {
    project.fps = reader.ReadDouble();
    if (version >= 2) {
      project.width = reader.ReadInt32();
      project.height = reader.ReadInt32();
      project.backgroundColor = TisfatReadColor(reader, version);
    }
  }

  return project;
};
