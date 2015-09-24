"use strict";

var BinaryReader = function(arrayBuffer, littleEndian) {
  this.arrayBuffer = arrayBuffer;
  this.dataView = new DataView(arrayBuffer);
  this.littleEndian = littleEndian;
  this.cursor = 0;
};

BinaryReader.prototype.Read = function(count) {
  var value = this.arrayBuffer.slice(this.cursor, this.cursor + count);
  this.cursor += count;
  return value;
};

BinaryReader.prototype.ReadBoolean = function() {
  return this.ReadByte() != 0;
}

BinaryReader.prototype.ReadByte = function() {
  var value = this.dataView.getUint8(this.cursor, this.littleEndian);
  this.cursor++;
  return value;
};

BinaryReader.prototype.ReadUInt16 = function() {
  var value = this.dataView.getUint16(this.cursor, this.littleEndian);
  this.cursor += 2;
  return value;
};

BinaryReader.prototype.ReadUInt32 = function() {
  var value = this.dataView.getUint32(this.cursor, this.littleEndian);
  this.cursor += 4;
  return value;
};

BinaryReader.prototype.ReadInt32 = function() {
  var value = this.dataView.getInt32(this.cursor, this.littleEndian);
  this.cursor += 4;
  return value;
};

BinaryReader.prototype.ReadDouble = function() {
  var value = this.dataView.getFloat64(this.cursor, this.littleEndian);
  this.cursor += 8;
  return value;
};

BinaryReader.prototype.ReadString = function() {
  var test = this.ReadByte();
  if (test >= 127) throw new Error("watch out");
  var data = this.Read(test);
  var decoded = String.fromCharCode.apply(null, new Uint8Array(data));
  return decoded;
};
