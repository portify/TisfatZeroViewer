"use strict";

// not the right place for this
var TisfatColorToCSS = function(color) {
  var r = color[0];
  var g = color[1];
  var b = color[2];
  var a = color[3];
  return "rgba(" + r + "," + g + "," + b + "," + a / 255 + ")";
};

var TisfatReadList = function(reader, version, func) {
  var list = [];
  var count = reader.ReadUInt16();

  for (var i = 0; i < count; i++) {
    list.push(func(reader, version));
  }

  return list;
};

var TisfatReadColor = function(reader, version) {
  var a = reader.ReadByte();
  var r = reader.ReadByte();
  var g = reader.ReadByte();
  var b = reader.ReadByte();
  return [r, g, b, a];
};

var TisfatReadBitmap = function(reader) {
  var bytes = reader.ReadInt32();
  var buffer = reader.Read(bytes);
  return "???";
};

var TisfatReadPointF = function(reader) {
  var x = reader.ReadDouble();
  var y = reader.ReadDouble();
  return [x, y];
};

var TisfatReadVec3 = function(reader) {
  var x = reader.ReadDouble();
  var y = reader.ReadDouble();
  var z = reader.ReadDouble();
  return [x, y, z];
};
