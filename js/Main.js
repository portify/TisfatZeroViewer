"use strict";

import {TisfatColorToCSS} from "./Util/FileFormat.js";
import BinaryReader from "./Util/BinaryReader.js";
import Project from "./Core/Project.js";

var FILE_FORMAT_VERSION = 6;

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

var playFrame = function(time) {
  if (!isPlaying)
    return;

  if (playStartTime === null)
    playStartTime = time;

  var frame = playStartFrame + (time - playStartTime) / 1000 * project.fps;
  eTime.value = frame;
  draw();

  if (frame >= project.getEndTime())
    setPlaying(false);
  else
    requestAnimationFrame(playFrame);
};

var setPlaying = function(state) {
  if (state) {
    if (!isPlaying)
      requestAnimationFrame(playFrame);

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
};

var draw = function() {
  if (project === null)
    return;

  eText.textContent = "Frame " + (Math.floor(eTime.value) + 1) + "/" + (project.getEndTime() + 1);

  var context = eView.getContext("2d");

  context.fillStyle = TisfatColorToCSS(project.backgroundColor);
  context.fillRect(0, 0, eView.width, eView.height);

  project.draw(context, eTime.value);
};

var onProjectLoad = function() {
  eTextView.style.display = "none";
  eMainView.style.display = "block";

  eView.width = project.width;
  eView.height = project.height;

  eTime.max = project.getEndTime();
  eTime.value = 0;
  eTime.style.width = project.width + "px";

  draw();
};

eBtnPlay.addEventListener("click", function() {
  if (project === null)
    return;

  setPlaying(!isPlaying);
});

eTime.addEventListener("input", function() {
  if (isPlaying) {
    playStartTime = null;
    playStartFrame = parseFloat(eTime.value);
  }

  draw();
});

eTextView.textContent = "Loading TISFAT Zero project...";
eLink.href = location.search.substring(1);

fetch(eLink.href).then(function(response) {
  if (!response.ok)
    throw new Error();
  return response.arrayBuffer();
}).then(function(arrayBuffer) {
  eTextView.textContent = "Parsing TISFAT Zero project...";
  var reader = new BinaryReader(arrayBuffer, true);
  var version = reader.ReadUInt16();

  if (version > FILE_FORMAT_VERSION)
    throw new Error("what is this newfound technology (" + version + " file vs " + FILE_FORMAT_VERSION + " player)");

  project = Project.read(reader, version);
  onProjectLoad();
}).catch(function(error) {
  console.log(error);
  eTextView.textContent = "Failed to load TISFAT Zero project. Check for bad links, CORS support or a malformed project file. " + error;
});
