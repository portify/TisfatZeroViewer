"use strict";

// not the right place for this
export function TisfatColorToCSS(color) {
  const [a, r, g, b] = color;
  return `rgba(${r},${g},${b},${a/255})`;
}

export function TisfatReadList(reader, version, func) {
  const list = [];
  const count = reader.ReadUInt16();

  for (var i = 0; i < count; i++) {
    list.push(func(reader, version));
  }

  return list;
}

export function TisfatReadColor(reader, version) {
  const a = reader.ReadByte();
  const r = reader.ReadByte();
  const g = reader.ReadByte();
  const b = reader.ReadByte();
  return [a, r, g, b];
}

export function TisfatReadBitmap(reader) {
  const bytes = reader.ReadInt32();
  const buffer = reader.Read(bytes);

  const blob = new Blob([buffer], {type: "image/png"});

  const domURL = window.URL || window.webkitURL || window;
  const url = domURL.createObjectURL(blob);
  const img = new Image();

  img.onload = () => domURL.revokeObjectURL(url);
  img.src = url;

  return img;
}

export function TisfatReadPointF(reader) {
  const x = reader.ReadDouble();
  const y = reader.ReadDouble();
  return [x, y];
}

export function TisfatReadVec3(reader) {
  const x = reader.ReadDouble();
  const y = reader.ReadDouble();
  const z = reader.ReadDouble();
  return [x, y, z];
}
