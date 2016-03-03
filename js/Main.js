/* global self */

"use strict";

import {TisfatColorToCSS} from "./Util/FileFormat.js";
import BinaryReader from "./Util/BinaryReader.js";
import Project from "./Core/Project.js";

var FILE_FORMAT_VERSION = 7;

if (top === self)
  document.body.style.backgroundColor = "black";

var eTextView = document.getElementById("text-view");
var eMainView = document.getElementById("main-view");

eTextView.style.display = "block";
eTextView.textContent = "Initializing player...";

var eView = document.getElementById("view");
var eTime = document.getElementById("time");
var eText = document.getElementById("text");
var eLink = document.getElementById("link");
var eBtnPlay = document.getElementById("btn-play");

var project = null;
var isPlaying = false;
var playStartFrame = null;
var playStartTime = null;

function playFrame(time) {
  if (!isPlaying)
    return;

  if (playStartTime === null)
    playStartTime = time;

  // const frame = playStartFrame + (time - playStartTime) / 1000 * project.fps;
  let frame;
  frame = (time - playStartTime) / 1000;
  let x = 1.0 / project.fps;
  frame = Math.floor(frame / x) * x; // this seems inefficient
  frame *= project.animSpeed;
  frame += playStartFrame;

  eTime.value = frame;
  draw();

  if (frame >= project.getEndTime())
    setPlaying(false);
  else
    requestAnimationFrame(playFrame);
}

function setPlaying(state) {
  if (state) {
    if (!isPlaying)
      requestAnimationFrame(playFrame);

    if (eTime.value >= project.getEndTime())
      eTime.value = 0;

    isPlaying = true;
    playStartTime = null;
    playStartFrame = parseFloat(eTime.value);

    eBtnPlay.textContent = "Pause";
  }
  else {
    isPlaying = false;
    playStartTime = null;
    playStartFrame = null;

    eBtnPlay.textContent = "Play";
  }
}

function draw() {
  if (project === null)
    return;

  eText.textContent = "Frame " + (Math.floor(eTime.value) + 1) + "/" + (project.getEndTime() + 1);

  var context = eView.getContext("2d");

  context.fillStyle = TisfatColorToCSS(project.backgroundColor);
  context.fillRect(0, 0, eView.width, eView.height);

  context.save();

  const cameraLayer = project.layers[0];
  const cameraState = cameraLayer.findCurrentState(eTime.value);
  cameraLayer.data.transform(context, cameraState);

  project.draw(context, eTime.value);
  context.restore();
}

function onProjectLoad() {
  eTextView.style.display = "none";
  eMainView.style.display = "block";

  eView.width = project.width;
  eView.height = project.height;

  eTime.max = project.getEndTime();
  eTime.value = 0;
  eTime.style.width = project.width + "px";

  draw();
}

eBtnPlay.addEventListener("click", () => {
  if (project === null)
    return;

  setPlaying(!isPlaying);
});

eTime.addEventListener("input", () => {
  if (isPlaying) {
    playStartTime = null;
    playStartFrame = parseFloat(eTime.value);
  }

  draw();
});

eTextView.textContent = "Loading TISFAT Zero project...";
eLink.href = location.search.substring(1);

class BadVersionError {
  constructor(version, maxSupported) {
    this.version = version;
    this.maxSupported = maxSupported;
  }
}

class HTTPError { }

fetch(eLink.href).then(response => {
  if (!response.ok)
    throw new HTTPError();

  return response.arrayBuffer();
}).then(arrayBuffer => {
  eTextView.textContent = "Parsing TISFAT Zero project...";
  var reader = new BinaryReader(arrayBuffer, true);
  var version = reader.ReadUInt16();

  if (version > FILE_FORMAT_VERSION)
    throw new BadVersionError(version, FILE_FORMAT_VERSION);

  project = Project.read(reader, version);
  onProjectLoad();
}).catch(error => {
  console.error(error);
  console.log(error.stack);

  if (error instanceof HTTPError) {
    eTextView.textContent = `Failed to fetch the project file from '${eLink.href}'.
                             Check for bad links or CORS support.`;
  } else if (error instanceof BadVersionError) {
    eTextView.textContent = `Failed to parse the project (file format version ${error.version},
                             this viewer only supports up to version ${error.maxSupported})`;
  } else {
    eTextView.textContent = "Something unhandled went wrong while trying to load the project. " + error;
  }
});
