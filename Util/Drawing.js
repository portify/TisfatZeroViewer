"use strict";

var TisfatCircle = function(ctx, center, radius, color) {
  ctx.beginPath();
  ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = TisfatColorToCSS(color);
  ctx.fill();
};

var TisfatCappedLine = function(ctx, a, b, thickness, color) {
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.lineWidth = thickness * 2;
  ctx.strokeStyle = TisfatColorToCSS(color);
  ctx.stroke();

  TisfatCircle(ctx, a, thickness, color);
  TisfatCircle(ctx, b, thickness, color);
};
