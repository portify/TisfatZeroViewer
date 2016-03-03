"use strict";

import ExtendableError from "./ExtendableError.js";

export class DataFormatError extends ExtendableError { }

export default class BinaryReader {
  constructor(arrayBuffer, littleEndian) {
    this.arrayBuffer = arrayBuffer;
    this.dataView = new DataView(arrayBuffer);
    this.littleEndian = littleEndian;
    this.cursor = 0;
  }

  Read(count) {
    var value = this.arrayBuffer.slice(this.cursor, this.cursor + count);
    this.cursor += count;
    return value;
  }

  ReadBoolean() {
    return this.ReadByte() !== 0;
  }

  ReadByte() {
    var value = this.dataView.getUint8(this.cursor, this.littleEndian);
    this.cursor++;
    return value;
  }

  ReadUInt16() {
    var value = this.dataView.getUint16(this.cursor, this.littleEndian);
    this.cursor += 2;
    return value;
  }

  ReadUInt32() {
    var value = this.dataView.getUint32(this.cursor, this.littleEndian);
    this.cursor += 4;
    return value;
  }

  ReadInt32() {
    var value = this.dataView.getInt32(this.cursor, this.littleEndian);
    this.cursor += 4;
    return value;
  }

  ReadDouble() {
    var value = this.dataView.getFloat64(this.cursor, this.littleEndian);
    this.cursor += 8;
    return value;
  }

  Read7BitEncodedInt() {
      // Read out an Int32 7 bits at a time.  The high bit
      // of the byte when on means to continue reading more bytes.
      var count = 0;
      var shift = 0;
      var b;
      do {
          // Check for a corrupted stream.  Read a max of 5 bytes.
          // In a future version, add a DataFormatException.
          if (shift == 5 * 7)  // 5 bytes max per Int32, shift += 7
              throw new DataFormatError("Bad 7-bit encoded Int32");

          // ReadByte handles end of stream cases for us.
          b = this.ReadByte();
          count |= (b & 0x7F) << shift;
          shift += 7;
      } while ((b & 0x80) !== 0);
      return count;
  }

  ReadString() {
    //var test = this.ReadByte();
    //if (test >= 127) throw new Error("watch out");
    var test = this.Read7BitEncodedInt();
    var data = this.Read(test);
    var decoded = String.fromCharCode.apply(null, new Uint8Array(data));
    return decoded;
  }
}
