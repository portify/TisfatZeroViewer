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

BinaryReader.prototype.Read7BitEncodedInt = function() {
    // Read out an Int32 7 bits at a time.  The high bit
    // of the byte when on means to continue reading more bytes.
    var count = 0;
    var shift = 0;
    var b;
    do {
        // Check for a corrupted stream.  Read a max of 5 bytes.
        // In a future version, add a DataFormatException.
        if (shift == 5 * 7)  // 5 bytes max per Int32, shift += 7
            throw new Error("Format_Bad7BitInt32");

        // ReadByte handles end of stream cases for us.
        b = this.ReadByte();
        count |= (b & 0x7F) << shift;
        shift += 7;
    } while ((b & 0x80) != 0);
    return count;
}

BinaryReader.prototype.ReadString = function() {
  //var test = this.ReadByte();
  //if (test >= 127) throw new Error("watch out");
  var test = this.Read7BitEncodedInt();
  var data = this.Read(test);
  var decoded = String.fromCharCode.apply(null, new Uint8Array(data));
  return decoded;
};
