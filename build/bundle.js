/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* global self */
	
	"use strict";
	
	var _FileFormat = __webpack_require__(1);
	
	var _BinaryReader = __webpack_require__(2);
	
	var _BinaryReader2 = _interopRequireDefault(_BinaryReader);
	
	var _Project = __webpack_require__(4);
	
	var _Project2 = _interopRequireDefault(_Project);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var FILE_FORMAT_VERSION = 6;
	
	if (top === self) document.body.style.backgroundColor = "black";
	
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
	  if (!isPlaying) return;
	
	  if (playStartTime === null) playStartTime = time;
	
	  // const frame = playStartFrame + (time - playStartTime) / 1000 * project.fps;
	  var frame = undefined;
	  frame = (time - playStartTime) / 1000;
	  var x = 1.0 / project.fps;
	  frame = Math.floor(frame / x) * x; // this seems inefficient
	  frame *= project.animSpeed;
	  frame += playStartFrame;
	
	  eTime.value = frame;
	  draw();
	
	  if (frame >= project.getEndTime()) setPlaying(false);else requestAnimationFrame(playFrame);
	}
	
	function setPlaying(state) {
	  if (state) {
	    if (!isPlaying) requestAnimationFrame(playFrame);
	
	    isPlaying = true;
	    playStartTime = null;
	    playStartFrame = parseFloat(eTime.value);
	
	    eBtnPlay.textContent = "Pause";
	  } else {
	    isPlaying = false;
	    playStartTime = null;
	    playStartFrame = null;
	
	    eBtnPlay.textContent = "Play";
	  }
	}
	
	function draw() {
	  if (project === null) return;
	
	  eText.textContent = "Frame " + (Math.floor(eTime.value) + 1) + "/" + (project.getEndTime() + 1);
	
	  var context = eView.getContext("2d");
	
	  context.fillStyle = (0, _FileFormat.TisfatColorToCSS)(project.backgroundColor);
	  context.fillRect(0, 0, eView.width, eView.height);
	
	  context.save();
	
	  var cameraLayer = project.layers[0];
	  var cameraState = cameraLayer.findCurrentState(eTime.value);
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
	
	eBtnPlay.addEventListener("click", function () {
	  if (project === null) return;
	
	  setPlaying(!isPlaying);
	});
	
	eTime.addEventListener("input", function () {
	  if (isPlaying) {
	    playStartTime = null;
	    playStartFrame = parseFloat(eTime.value);
	  }
	
	  draw();
	});
	
	eTextView.textContent = "Loading TISFAT Zero project...";
	eLink.href = location.search.substring(1);
	
	var BadVersionError = function BadVersionError(version, maxSupported) {
	  _classCallCheck(this, BadVersionError);
	
	  this.version = version;
	  this.maxSupported = maxSupported;
	};
	
	var HTTPError = function HTTPError() {
	  _classCallCheck(this, HTTPError);
	};
	
	fetch(eLink.href).then(function (response) {
	  if (!response.ok) throw new HTTPError();
	
	  return response.arrayBuffer();
	}).then(function (arrayBuffer) {
	  eTextView.textContent = "Parsing TISFAT Zero project...";
	  var reader = new _BinaryReader2.default(arrayBuffer, true);
	  var version = reader.ReadUInt16();
	
	  if (version > FILE_FORMAT_VERSION) throw new BadVersionError(version, FILE_FORMAT_VERSION);
	
	  project = _Project2.default.read(reader, version);
	  onProjectLoad();
	}).catch(function (error) {
	  console.error(error);
	  console.log(error.stack);
	
	  if (error instanceof HTTPError) {
	    eTextView.textContent = "Failed to fetch the project file from '" + eLink.href + "'.\n                             Check for bad links or CORS support.";
	  } else if (error instanceof BadVersionError) {
	    eTextView.textContent = "Failed to parse the project (file format version " + error.version + ",\n                             this viewer only supports up to version " + error.maxSupported + ")";
	  } else {
	    eTextView.textContent = "Something unhandled went wrong while trying to load the project. " + error;
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	// not the right place for this
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.TisfatColorToCSS = TisfatColorToCSS;
	exports.TisfatReadList = TisfatReadList;
	exports.TisfatReadColor = TisfatReadColor;
	exports.TisfatReadBitmap = TisfatReadBitmap;
	exports.TisfatReadPointF = TisfatReadPointF;
	exports.TisfatReadVec3 = TisfatReadVec3;
	function TisfatColorToCSS(color) {
	  var _color = _slicedToArray(color, 4);
	
	  var a = _color[0];
	  var r = _color[1];
	  var g = _color[2];
	  var b = _color[3];
	
	  return "rgba(" + r + "," + g + "," + b + "," + a / 255 + ")";
	}
	
	function TisfatReadList(reader, version, func) {
	  var list = [];
	  var count = reader.ReadUInt16();
	
	  for (var i = 0; i < count; i++) {
	    list.push(func(reader, version));
	  }
	
	  return list;
	}
	
	function TisfatReadColor(reader, version) {
	  var a = reader.ReadByte();
	  var r = reader.ReadByte();
	  var g = reader.ReadByte();
	  var b = reader.ReadByte();
	  return [a, r, g, b];
	}
	
	function TisfatReadBitmap(reader) {
	  var bytes = reader.ReadInt32();
	  var buffer = reader.Read(bytes);
	  return "???";
	}
	
	function TisfatReadPointF(reader) {
	  var x = reader.ReadDouble();
	  var y = reader.ReadDouble();
	  return [x, y];
	}
	
	function TisfatReadVec3(reader) {
	  var x = reader.ReadDouble();
	  var y = reader.ReadDouble();
	  var z = reader.ReadDouble();
	  return [x, y, z];
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DataFormatError = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ExtendableError2 = __webpack_require__(3);
	
	var _ExtendableError3 = _interopRequireDefault(_ExtendableError2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var DataFormatError = exports.DataFormatError = function (_ExtendableError) {
	  _inherits(DataFormatError, _ExtendableError);
	
	  function DataFormatError() {
	    _classCallCheck(this, DataFormatError);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(DataFormatError).apply(this, arguments));
	  }
	
	  return DataFormatError;
	}(_ExtendableError3.default);
	
	var BinaryReader = function () {
	  function BinaryReader(arrayBuffer, littleEndian) {
	    _classCallCheck(this, BinaryReader);
	
	    this.arrayBuffer = arrayBuffer;
	    this.dataView = new DataView(arrayBuffer);
	    this.littleEndian = littleEndian;
	    this.cursor = 0;
	  }
	
	  _createClass(BinaryReader, [{
	    key: "Read",
	    value: function Read(count) {
	      var value = this.arrayBuffer.slice(this.cursor, this.cursor + count);
	      this.cursor += count;
	      return value;
	    }
	  }, {
	    key: "ReadBoolean",
	    value: function ReadBoolean() {
	      return this.ReadByte() !== 0;
	    }
	  }, {
	    key: "ReadByte",
	    value: function ReadByte() {
	      var value = this.dataView.getUint8(this.cursor, this.littleEndian);
	      this.cursor++;
	      return value;
	    }
	  }, {
	    key: "ReadUInt16",
	    value: function ReadUInt16() {
	      var value = this.dataView.getUint16(this.cursor, this.littleEndian);
	      this.cursor += 2;
	      return value;
	    }
	  }, {
	    key: "ReadUInt32",
	    value: function ReadUInt32() {
	      var value = this.dataView.getUint32(this.cursor, this.littleEndian);
	      this.cursor += 4;
	      return value;
	    }
	  }, {
	    key: "ReadInt32",
	    value: function ReadInt32() {
	      var value = this.dataView.getInt32(this.cursor, this.littleEndian);
	      this.cursor += 4;
	      return value;
	    }
	  }, {
	    key: "ReadDouble",
	    value: function ReadDouble() {
	      var value = this.dataView.getFloat64(this.cursor, this.littleEndian);
	      this.cursor += 8;
	      return value;
	    }
	  }, {
	    key: "Read7BitEncodedInt",
	    value: function Read7BitEncodedInt() {
	      // Read out an Int32 7 bits at a time.  The high bit
	      // of the byte when on means to continue reading more bytes.
	      var count = 0;
	      var shift = 0;
	      var b;
	      do {
	        // Check for a corrupted stream.  Read a max of 5 bytes.
	        // In a future version, add a DataFormatException.
	        if (shift == 5 * 7) // 5 bytes max per Int32, shift += 7
	          throw new DataFormatError("Bad 7-bit encoded Int32");
	
	        // ReadByte handles end of stream cases for us.
	        b = this.ReadByte();
	        count |= (b & 0x7F) << shift;
	        shift += 7;
	      } while ((b & 0x80) !== 0);
	      return count;
	    }
	  }, {
	    key: "ReadString",
	    value: function ReadString() {
	      //var test = this.ReadByte();
	      //if (test >= 127) throw new Error("watch out");
	      var test = this.Read7BitEncodedInt();
	      var data = this.Read(test);
	      var decoded = String.fromCharCode.apply(null, new Uint8Array(data));
	      return decoded;
	    }
	  }]);
	
	  return BinaryReader;
	}();

	exports.default = BinaryReader;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var ExtendableError = function (_Error) {
	  _inherits(ExtendableError, _Error);
	
	  function ExtendableError(message) {
	    _classCallCheck(this, ExtendableError);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExtendableError).call(this));
	
	    _this.message = message;
	    _this.stack = new Error().stack;
	    _this.name = _this.constructor.name;
	    return _this;
	  }
	
	  return ExtendableError;
	}(Error);
	
	exports.default = ExtendableError;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Layer = __webpack_require__(5);
	
	var _Layer2 = _interopRequireDefault(_Layer);
	
	var _FileFormat = __webpack_require__(1);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Project = function () {
	  function Project() {
	    _classCallCheck(this, Project);
	
	    this.layers = [];
	    this.animSpeed = 10.0;
	    this.fps = 60.0;
	    this.width = 460;
	    this.height = 360;
	    this.backgroundColor = [255, 255, 255, 255];
	  }
	
	  _createClass(Project, [{
	    key: "draw",
	    value: function draw(ctx, time) {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = this.layers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var layer = _step.value;
	
	          layer.draw(ctx, time);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: "getEndTime",
	    value: function getEndTime() {
	      var endTime = 0;
	
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;
	
	      try {
	        for (var _iterator2 = this.layers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var layer = _step2.value;
	
	          endTime = Math.max(endTime, layer.framesets[layer.framesets.length - 1].getEndTime());
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	
	      return endTime;
	    }
	  }], [{
	    key: "read",
	    value: function read(reader, version) {
	      var project = new Project();
	      project.layers = (0, _FileFormat.TisfatReadList)(reader, version, _Layer2.default.read);
	
	      if (version < 6) {
	        /* Camera camera = new Camera();
	        Layers.Insert(0, camera.CreateDefaultLayer(0, (uint)Program.MainTimeline.GetLastTime(), null)); */
	      }
	
	      if (version >= 1) {
	        project.animSpeed = reader.ReadDouble();
	
	        if (version >= 5) project.fps = reader.ReadDouble();
	
	        if (version >= 2) {
	          project.width = reader.ReadInt32();
	          project.height = reader.ReadInt32();
	          project.backgroundColor = (0, _FileFormat.TisfatReadColor)(reader, version);
	        }
	      }
	
	      return project;
	    }
	  }]);
	
	  return Project;
	}();

	exports.default = Project;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _FileFormat = __webpack_require__(1);
	
	var _EntityIDs = __webpack_require__(6);
	
	var _Frameset = __webpack_require__(16);
	
	var _Frameset2 = _interopRequireDefault(_Frameset);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Layer = function () {
	  function Layer() {
	    _classCallCheck(this, Layer);
	
	    this.name = "Layer";
	    this.visible = true;
	    this.timelineColor = "aliceblue";
	    this.framesets = [];
	    this.depth = 0;
	  }
	
	  _createClass(Layer, [{
	    key: "findFrameset",
	    value: function findFrameset(time) {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = this.framesets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var frameset = _step.value;
	
	          if (time >= frameset.getStartTime() && time <= frameset.getEndTime()) return frameset;
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      return null;
	    }
	  }, {
	    key: "findCurrentState",
	    value: function findCurrentState(time) {
	      if (!this.visible || this.data === null) return null;
	
	      var frameset = this.findFrameset(time);
	
	      if (frameset === null) return null;
	
	      var nextIndex = undefined;
	
	      for (nextIndex = 1; nextIndex < frameset.keyframes.length; nextIndex++) {
	        if (frameset.keyframes[nextIndex].time >= time) break;
	      }
	
	      var current = frameset.keyframes[nextIndex - 1];
	      var target = frameset.keyframes[nextIndex];
	
	      var t = (time - current.time) / (target.time - current.time);
	      return this.data.interpolate(t, current.state, target.state, current.interpMode);
	    }
	  }, {
	    key: "draw",
	    value: function draw(ctx, time) {
	      var state = this.findCurrentState(time);
	
	      if (state !== null) this.data.draw(ctx, state);
	    }
	  }], [{
	    key: "read",
	    value: function read(reader, version) {
	      var layer = new Layer();
	      layer.name = reader.ReadString();
	      layer.visible = reader.ReadBoolean();
	      layer.timelineColor = (0, _FileFormat.TisfatReadColor)(reader, version);
	      var type = (0, _EntityIDs.TisfatResolveEntityID)(reader.ReadUInt16());
	      layer.data = type.read(reader, version);
	      layer.framesets = (0, _FileFormat.TisfatReadList)(reader, version, _Frameset2.default.read);
	
	      return layer;
	    }
	  }]);
	
	  return Layer;
	}();

	exports.default = Layer;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.TisfatResolveEntityID = TisfatResolveEntityID;
	exports.TisfatResolveEntityStateID = TisfatResolveEntityStateID;
	
	var _StickFigure = __webpack_require__(7);
	
	var _LineObject = __webpack_require__(10);
	
	var _RectObject = __webpack_require__(11);
	
	var _CircleObject = __webpack_require__(12);
	
	var _PolyObject = __webpack_require__(13);
	
	var _TextObject = __webpack_require__(14);
	
	var _Camera = __webpack_require__(15);
	
	// import {BitmapObject, BitmapObjectState} from "../Entities/BitmapObject.js";
	// import {PointLight, PointLightState} from "../Entities/PointLight.js";
	
	
	var TisfatEntityTypes = {
	  "0": _StickFigure.StickFigure,
	  // "1": BitmapObject,
	  // "2": PointLight,
	  "3": _LineObject.LineObject,
	  "4": _RectObject.RectObject,
	  "5": _CircleObject.CircleObject,
	  "6": _PolyObject.PolyObject,
	  "7": _TextObject.TextObject,
	  // "8": CustomFigure,
	  "9": _Camera.Camera
	};
	// import {CustomFigure, CustomFigureState} from "../Entities/CustomFigure.js";
	
	
	var TisfatEntityStateTypes = {
	  "0": _StickFigure.StickFigureState,
	  // "1": BitmapObjectState,
	  // "2": PointLightState,
	  "3": _LineObject.LineObjectState,
	  "4": _RectObject.RectObjectState,
	  "5": _CircleObject.CircleObjectState,
	  "6": _PolyObject.PolyObjectState,
	  "7": _TextObject.TextObjectState,
	  // "8": CustomFigureState,
	  "9": _Camera.CameraState
	};
	
	function TisfatResolveEntityID(id) {
	  if (TisfatEntityTypes[id]) return TisfatEntityTypes[id];
	
	  throw new Error("cannot resolve entity id " + id);
	}
	
	function TisfatResolveEntityStateID(id) {
	  if (TisfatEntityStateTypes[id]) return TisfatEntityStateTypes[id];
	
	  throw new Error("cannot resolve entity state id " + id);
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.StickFigureJoint = exports.StickFigureState = exports.StickFigure = exports.StickFigureJointState = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _FileFormat = __webpack_require__(1);
	
	var _Drawing = __webpack_require__(8);
	
	var _Interpolation = __webpack_require__(9);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var StickFigureJointState = exports.StickFigureJointState = function () {
	  function StickFigureJointState() {
	    _classCallCheck(this, StickFigureJointState);
	
	    this.parent = null;
	    this.children = [];
	    this.location = [0, 0];
	    this.jointColor = [255, 0, 0, 0];
	    this.thickness = 6;
	    this.bitmapIndex = -1;
	    this.manipulatable = true;
	  }
	
	  _createClass(StickFigureJointState, null, [{
	    key: "read",
	    value: function read(reader, version) {
	      var state = new StickFigureJointState();
	      state.location = (0, _FileFormat.TisfatReadPointF)(reader, version);
	      state.jointColor = (0, _FileFormat.TisfatReadColor)(reader, version);
	      state.thickness = reader.ReadDouble();
	
	      if (version >= 2) {
	        state.manipulatable = reader.ReadBoolean();
	
	        if (version >= 4) state.bitmapIndex = reader.ReadInt32();
	      }
	
	      state.children = (0, _FileFormat.TisfatReadList)(reader, version, StickFigureJointState.read);
	
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = state.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var child = _step.value;
	
	          child.parent = state;
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      return state;
	    }
	  }, {
	    key: "interpolate",
	    value: function interpolate(t, current, target, mode) {
	      var state = new StickFigureJointState();
	      state.parent = current.parent;
	      state.bitmapIndex = current.bitmapIndex;
	
	      state.location = (0, _Interpolation.InterpolatePointF)(t, current.location, target.location, mode);
	      state.jointColor = (0, _Interpolation.InterpolateColor)(t, current.jointColor, target.jointColor, mode);
	      state.thickness = (0, _Interpolation.Interpolate)(t, current.thickness, target.thickness, mode);
	
	      for (var i = 0; i < current.children.length; i++) {
	        state.children.push(StickFigureJointState.interpolate(t, current.children[i], target.children[i], mode));
	      }
	
	      return state;
	    }
	  }]);
	
	  return StickFigureJointState;
	}();
	
	var StickFigure = exports.StickFigure = function () {
	  function StickFigure() {
	    _classCallCheck(this, StickFigure);
	  }
	
	  _createClass(StickFigure, [{
	    key: "draw",
	    value: function draw(ctx, state) {
	      this.root.draw(ctx, state.root);
	    }
	  }, {
	    key: "interpolate",
	    value: function interpolate(t, current, target, mode) {
	      var state = new StickFigureState();
	      state.root = StickFigureJointState.interpolate(t, current.root, target.root, mode);
	      return state;
	    }
	  }], [{
	    key: "read",
	    value: function read(reader, version) {
	      var figure = new StickFigure();
	      figure.root = StickFigureJoint.read(reader, version);
	      return figure;
	    }
	  }]);
	
	  return StickFigure;
	}();
	
	var StickFigureState = exports.StickFigureState = function () {
	  function StickFigureState() {
	    _classCallCheck(this, StickFigureState);
	  }
	
	  _createClass(StickFigureState, null, [{
	    key: "read",
	    value: function read(reader, version) {
	      var state = new StickFigureState();
	      state.root = StickFigureJointState.read(reader, version);
	      return state;
	    }
	  }]);
	
	  return StickFigureState;
	}();
	
	var StickFigureJoint = exports.StickFigureJoint = function () {
	  function StickFigureJoint() {
	    _classCallCheck(this, StickFigureJoint);
	
	    this.parent = null;
	    this.children = [];
	    this.jointColor = [255, 0, 0, 0];
	    this.handleColor = [255, 0, 0, 255];
	    this.thickness = 6;
	
	    // this.bitmaps = [];
	    // this.bitmapOffsets = new Map();
	    this.initialBitmapIndex = -1;
	
	    this.handleVisible = true;
	    this.visible = true;
	    this.manipulatable = true;
	  }
	
	  _createClass(StickFigureJoint, [{
	    key: "draw",
	    value: function draw(ctx, state) {
	      if (this.children.count != state.children.count) throw new Error("state does not match this joint");
	
	      for (var i = 0; i < this.children.length; i++) {
	        this.children[i].drawTo(ctx, state.children[i], this, state);
	        this.children[i].draw(ctx, state.children[i]);
	      }
	    }
	  }, {
	    key: "drawTo",
	    value: function drawTo(ctx, state, otherJoint, otherState) {
	      if (!this.visible) return;
	
	      switch (this.drawType) {
	        case "CircleLine":
	          var dx = state.location[0] - otherState.location[0];
	          var dy = state.location[1] - otherState.location[1];
	          var r = Math.sqrt(dx * dx + dy * dy) / 2;
	
	          var x = otherState.location[0] + dx / 2;
	          var y = otherState.location[1] + dy / 2;
	
	          (0, _Drawing.TisfatCircle)(ctx, [x, y], r, state.jointColor);
	          break;
	        case "CircleRadius":
	          (0, _Drawing.TisfatCircle)(ctx, state.location, state.thickness, state.jointColor);
	          break;
	        case "Normal":
	          (0, _Drawing.TisfatCappedLine)(ctx, state.location, otherState.location, state.thickness, state.jointColor);
	          break;
	        default:
	          throw new Error("unknown joint drawing type " + this.drawType);
	      }
	    }
	  }], [{
	    key: "read",
	    value: function read(reader, version) {
	      var joint = new StickFigureJoint();
	      joint.parent = null;
	
	      joint.location = (0, _FileFormat.TisfatReadPointF)(reader, version);
	      joint.jointColor = (0, _FileFormat.TisfatReadColor)(reader, version);
	      joint.handleColor = (0, _FileFormat.TisfatReadColor)(reader, version);
	      joint.thickness = reader.ReadDouble();
	
	      if (version >= 2) {
	        joint.drawType = reader.ReadString();
	        joint.handleVisible = reader.ReadBoolean();
	        joint.manipulatable = reader.ReadBoolean();
	        joint.visible = reader.ReadBoolean();
	      } else {
	        joint.drawType = reader.ReadBoolean() ? "CircleLine" : "Normal";
	      }
	
	      joint.children = (0, _FileFormat.TisfatReadList)(reader, version, StickFigureJoint.read);
	
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;
	
	      try {
	        for (var _iterator2 = joint.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var child = _step2.value;
	
	          child.parent = joint;
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	
	      if (version >= 4) {
	        var names = (0, _FileFormat.TisfatReadList)(reader, version, function (r) {
	          return r.ReadString();
	        });
	        var images = (0, _FileFormat.TisfatReadList)(reader, version, _FileFormat.TisfatReadBitmap);
	        var rotations = (0, _FileFormat.TisfatReadList)(reader, version, function (r) {
	          return r.ReadDouble();
	        });
	        var offsets = (0, _FileFormat.TisfatReadList)(reader, version, _FileFormat.TisfatReadPointF);
	
	        // this.bitmaps = [];
	        // this.bitmapOffsets = new Map();
	
	        for (var i = 0; i < names.length; i++) {
	          // this.bitmaps.append(); // ???
	          // ???
	        }
	
	        this.initialBitmapIndex = reader.ReadInt32();
	      }
	
	      return joint;
	    }
	  }]);
	
	  return StickFigureJoint;
	}();

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.TisfatCircle = TisfatCircle;
	exports.TisfatCappedLine = TisfatCappedLine;
	
	var _FileFormat = __webpack_require__(1);
	
	function TisfatCircle(ctx, center, radius, color) {
	  ctx.beginPath();
	  ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI, false);
	  ctx.fillStyle = (0, _FileFormat.TisfatColorToCSS)(color);
	  ctx.fill();
	}
	
	function TisfatCappedLine(ctx, a, b, thickness, color) {
	  ctx.beginPath();
	  ctx.moveTo(a[0], a[1]);
	  ctx.lineTo(b[0], b[1]);
	  ctx.lineWidth = thickness * 2;
	  ctx.strokeStyle = (0, _FileFormat.TisfatColorToCSS)(color);
	  ctx.stroke();
	
	  TisfatCircle(ctx, a, thickness, color);
	  TisfatCircle(ctx, b, thickness, color);
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Interpolate = Interpolate;
	exports.InterpolatePointF = InterpolatePointF;
	exports.InterpolateColor = InterpolateColor;
	function Interpolate(t, a, b, mode) {
	  switch (mode) {
	    case "None":
	      return t < 1 ? a : b;
	    case "Linear":
	      return a + (b - a) * t;
	    case "QuadInOut":
	      b -= a;
	      t *= 2;
	
	      if (t < 1) return b / 2 * t * t + a;
	      t--;
	      return -b / 2 * (t * (t - 2) - 1) + a;
	    case "ExpoInOut":
	      b -= a;
	      t *= 2;
	
	      if (t < 1) return b / 2 * Math.pow(2, 10 * (t - 1)) + a;
	      t--;
	      return b / 2 * (-Math.pow(2, -10 * t) + 2) + a;
	    case "BounceOut":
	      b -= a;
	
	      if (t < 1 / 2.75) {
	        return b * (7.5625 * t * t) + a;
	      } else if (t < 2 / 2.75) {
	        t -= 1.5 / 2.75;
	        return b * (7.5625 * t * t + 0.75) + a;
	      } else if (t < 2.5 / 2.75) {
	        t -= 2.25 / 2.75;
	        return b * (7.5625 * t * t + 0.9375) + a;
	      } else {
	        t -= 2.625 / 2.75;
	        return b * (7.5625 * t * t + 0.984375) + a;
	      }
	      break; // thanks JSHint
	    case "BackOut":
	      b -= a;
	      // ew
	      return b * ((t = t - 1) * t * ((1.70158 + 1) * t + 1.70158) + 1) + a;
	    default:
	      throw new Error("unknown interpMode " + mode);
	  }
	}
	
	function InterpolatePointF(t, a, b, mode) {
	  return [Interpolate(t, a[0], b[0], mode), Interpolate(t, a[1], b[1], mode)];
	}
	
	function InterpolateColor(t, a, b, mode) {
	  return [Interpolate(t, a[0], b[0], mode), Interpolate(t, a[1], b[1], mode), Interpolate(t, a[2], b[2], mode), Interpolate(t, a[3], b[3], mode)];
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.LineObjectState = exports.LineObject = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Drawing = __webpack_require__(8);
	
	var _FileFormat = __webpack_require__(1);
	
	var _Interpolation = __webpack_require__(9);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var LineObject = exports.LineObject = function () {
	  function LineObject() {
	    _classCallCheck(this, LineObject);
	  }
	
	  _createClass(LineObject, [{
	    key: "draw",
	    value: function draw(ctx, state) {
	      (0, _Drawing.TisfatCappedLine)(ctx, state.a, state.b, state.thickness, state.color);
	    }
	  }, {
	    key: "interpolate",
	    value: function interpolate(t, current, target, mode) {
	      var state = new LineObjectState();
	      state.a = (0, _Interpolation.InterpolatePointF)(t, current.a, target.a, mode);
	      state.b = (0, _Interpolation.InterpolatePointF)(t, current.b, target.b, mode);
	      state.color = (0, _Interpolation.InterpolateColor)(t, current.color, target.color, mode);
	      state.thickness = (0, _Interpolation.Interpolate)(t, current.thickness, target.thickness, mode);
	      return state;
	    }
	  }], [{
	    key: "read",
	    value: function read() {
	      return new LineObject();
	    }
	  }]);
	
	  return LineObject;
	}();
	
	var LineObjectState = exports.LineObjectState = function () {
	  function LineObjectState() {
	    _classCallCheck(this, LineObjectState);
	  }
	
	  _createClass(LineObjectState, null, [{
	    key: "read",
	    value: function read(reader, version) {
	      var state = new LineObjectState();
	      state.a = (0, _FileFormat.TisfatReadPointF)(reader, version);
	      state.b = (0, _FileFormat.TisfatReadPointF)(reader, version);
	      state.color = (0, _FileFormat.TisfatReadColor)(reader, version);
	      state.thickness = reader.ReadDouble();
	      return state;
	    }
	  }]);
	
	  return LineObjectState;
	}();

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.RectObjectState = exports.RectObject = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _FileFormat = __webpack_require__(1);
	
	var _Interpolation = __webpack_require__(9);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var RectObject = exports.RectObject = function () {
	  function RectObject() {
	    _classCallCheck(this, RectObject);
	  }
	
	  _createClass(RectObject, [{
	    key: "draw",
	    value: function draw(ctx, state) {
	      ctx.fillStyle = (0, _FileFormat.TisfatColorToCSS)(state.color);
	      ctx.fillRect(state.position[0], state.position[1], state.extent[0], state.extent[1]);
	    }
	  }, {
	    key: "interpolate",
	    value: function interpolate(t, current, target, mode) {
	      var state = new RectObjectState();
	      state.position = (0, _Interpolation.InterpolatePointF)(t, current.position, target.position, mode);
	      state.extent = (0, _Interpolation.InterpolatePointF)(t, current.extent, target.extent, mode);
	      state.color = (0, _Interpolation.InterpolateColor)(t, current.color, target.color, mode);
	      return state;
	    }
	  }], [{
	    key: "read",
	    value: function read() {
	      return new RectObject();
	    }
	  }]);
	
	  return RectObject;
	}();
	
	var RectObjectState = exports.RectObjectState = function () {
	  function RectObjectState() {
	    _classCallCheck(this, RectObjectState);
	  }
	
	  _createClass(RectObjectState, null, [{
	    key: "read",
	    value: function read(reader, version) {
	      var state = new RectObjectState();
	      state.position = (0, _FileFormat.TisfatReadPointF)(reader, version);
	      state.extent = (0, _FileFormat.TisfatReadPointF)(reader, version);
	      state.color = version >= 3 ? (0, _FileFormat.TisfatReadColor)(reader, version) : [255, 0, 0, 0];
	      return state;
	    }
	  }]);
	
	  return RectObjectState;
	}();

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Drawing = __webpack_require__(8);
	
	var _Interpolation = __webpack_require__(9);
	
	var _FileFormat = __webpack_require__(1);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var CircleObject = function () {
	  function CircleObject() {
	    _classCallCheck(this, CircleObject);
	  }
	
	  _createClass(CircleObject, [{
	    key: "draw",
	    value: function draw(ctx, state) {
	      (0, _Drawing.TisfatCircle)(ctx, state.position, state.radius, state.color);
	    }
	  }, {
	    key: "interpolate",
	    value: function interpolate(t, current, target, mode) {
	      var state = new CircleObjectState();
	      state.position = (0, _Interpolation.InterpolatePointF)(t, current.position, target.position, mode);
	      state.radius = (0, _Interpolation.Interpolate)(t, current.radius, target.radius, mode);
	      state.color = (0, _Interpolation.InterpolateColor)(t, current.color, target.color, mode);
	      return state;
	    }
	  }], [{
	    key: "read",
	    value: function read() {
	      return new CircleObject();
	    }
	  }]);
	
	  return CircleObject;
	}();
	
	var CircleObjectState = function () {
	  function CircleObjectState() {
	    _classCallCheck(this, CircleObjectState);
	  }
	
	  _createClass(CircleObjectState, null, [{
	    key: "read",
	    value: function read(reader, version) {
	      var state = new CircleObjectState();
	      state.position = (0, _FileFormat.TisfatReadPointF)(reader, version);
	      state.radius = reader.ReadDouble();
	      state.color = (0, _FileFormat.TisfatReadColor)(reader, version);
	      return state;
	    }
	  }]);
	
	  return CircleObjectState;
	}();

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.PolyObjectState = exports.PolyObjectJoint = exports.PolyObject = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _FileFormat = __webpack_require__(1);
	
	var _Interpolation = __webpack_require__(9);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var PolyObject = exports.PolyObject = function () {
	  function PolyObject() {
	    _classCallCheck(this, PolyObject);
	  }
	
	  _createClass(PolyObject, [{
	    key: "interpolate",
	    value: function interpolate(t, current, target, mode) {
	      var state = new PolyObjectState();
	      state.color = (0, _Interpolation.InterpolateColor)(t, current.color, target.color, mode);
	
	      for (var i = 0; i < current.points.length; i++) {
	        var joint = new PolyObjectJoint();
	        joint.location = (0, _Interpolation.InterpolatePointF)(t, current.points[i].location, target.points[i].location, mode);
	        state.points.append(joint);
	      }
	
	      return state;
	    }
	  }, {
	    key: "draw",
	    value: function draw(ctx, state) {
	      ctx.fillStyle = (0, _FileFormat.TisfatColorToCSS)(state.color);
	      ctx.beginPath();
	      var isFirst = true;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = state.points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var location = _step.value.location;
	
	          if (isFirst) {
	            ctx.moveTo(location);
	            isFirst = false;
	          } else {
	            ctx.lineTo(location);
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      ctx.closePath();
	      ctx.fill();
	    }
	  }], [{
	    key: "read",
	    value: function read(reader, version) {
	      return new PolyObject();
	    }
	  }]);
	
	  return PolyObject;
	}();
	
	var PolyObjectJoint = exports.PolyObjectJoint = function () {
	  function PolyObjectJoint() {
	    _classCallCheck(this, PolyObjectJoint);
	  }
	
	  _createClass(PolyObjectJoint, null, [{
	    key: "read",
	    value: function read(reader, version) {
	      this.location = (0, _FileFormat.TisfatReadPointF)(reader, version);
	    }
	  }]);
	
	  return PolyObjectJoint;
	}();
	
	var PolyObjectState = exports.PolyObjectState = function () {
	  function PolyObjectState() {
	    _classCallCheck(this, PolyObjectState);
	  }
	
	  _createClass(PolyObjectState, null, [{
	    key: "read",
	    value: function read(reader, version) {
	      var state = new PolyObjectState();
	      state.points = (0, _FileFormat.TisfatReadList)(reader, version, PolyObjectJoint.read);
	      state.color = (0, _FileFormat.TisfatReadColor)(reader, version);
	      return state;
	    }
	  }]);
	
	  return PolyObjectState;
	}();

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.TextObjectState = exports.TextObject = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _FileFormat = __webpack_require__(1);
	
	var _Interpolation = __webpack_require__(9);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// TODO: handle .NET FontStyle [Flags] enum
	// FlagsAttribute causes the enum string to be a list separated by ", "
	var FontStyleMap = {
	  "Bold": "bold",
	  "Italic": "italic",
	  "Regular": "normal"
	};
	
	/* "Strikeout": "strikeout",
	"Underline": "underline" */
	var TextAlignmentMap = {
	  "Center": "center",
	  "Far": "end",
	  "Near": "start"
	};
	
	var TextBaselineMap = {
	  "Center": "middle",
	  "Far": "bottom",
	  "Near": "top"
	};
	
	var TextObject = exports.TextObject = function () {
	  function TextObject() {
	    _classCallCheck(this, TextObject);
	  }
	
	  _createClass(TextObject, [{
	    key: "draw",
	    value: function draw(ctx, state) {
	      ctx.font = state.textFont;
	      ctx.fillStyle = (0, _FileFormat.TisfatColorToCSS)(state.textColor);
	      ctx.textAlign = TextAlignmentMap[state.textAlignment];
	      ctx.textBaseline = "top";
	      // TODO: take into account state.size!
	      ctx.fillText(state.text, state.location, state.location);
	    }
	  }, {
	    key: "interpolate",
	    value: function interpolate(t, current, target, mode) {
	      var state = new TextObjectState();
	
	      state.location = (0, _Interpolation.InterpolatePointF)(t, current.location, target.location, mode);
	      state.size = (0, _Interpolation.InterpolatePointF)(t, current.size, target.size, mode);
	
	      state.text = current.text;
	      state.textAlignment = current.textAlignment;
	      state.textFont = current.textFont;
	      state.textColor = (0, _Interpolation.InterpolateColor)(t, current.textColor, target.textColor, mode);
	
	      return state;
	    }
	  }], [{
	    key: "read",
	    value: function read() {
	      return new TextObject();
	    }
	  }]);
	
	  return TextObject;
	}();
	
	var TextObjectState = exports.TextObjectState = function () {
	  function TextObjectState() {
	    _classCallCheck(this, TextObjectState);
	  }
	
	  _createClass(TextObjectState, null, [{
	    key: "read",
	    value: function read(reader, version) {
	      var state = new TextObjectState();
	      state.location = (0, _FileFormat.TisfatReadPointF)(reader, version);
	      state.size = (0, _FileFormat.TisfatReadPointF)(reader, version);
	      state.text = reader.ReadString();
	      var fontName = reader.ReadString();
	      var fontSize = reader.ReadDouble();
	      var fontStyle = reader.ReadString(); // ReadInt32
	      state.textFont = FontStyleMap[fontStyle] + " " + fontSize + "px " + fontName;
	      return state;
	    }
	  }]);
	
	  return TextObjectState;
	}();

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.CameraState = exports.Camera = undefined;
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _FileFormat = __webpack_require__(1);
	
	var _Interpolation = __webpack_require__(9);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Camera = exports.Camera = function () {
	  function Camera() {
	    _classCallCheck(this, Camera);
	  }
	
	  _createClass(Camera, [{
	    key: "interpolate",
	    value: function interpolate(t, current, target, mode) {
	      var state = new CameraState();
	      state.location = (0, _Interpolation.InterpolatePointF)(t, current.location, target.location, mode);
	      state.angle = (0, _Interpolation.Interpolate)(t, current.angle, target.angle, mode);
	      state.scale = (0, _Interpolation.Interpolate)(t, current.scale, target.scale, mode);
	      return state;
	    }
	  }, {
	    key: "draw",
	    value: function draw() {/* stub */}
	  }, {
	    key: "transform",
	    value: function transform(ctx, state) {
	      var _state$location = _slicedToArray(state.location, 2);
	
	      var x = _state$location[0];
	      var y = _state$location[1];
	
	      var inv = 1 / state.scale;
	      // ctx.translate(-x * 1 / state.scale, -y * 1 / state.scale);
	      ctx.translate(-x / state.scale, -y / state.scale);
	      ctx.scale(inv, inv);
	      ctx.rotate(state.angle);
	    }
	  }], [{
	    key: "read",
	    value: function read() {
	      return new Camera();
	    }
	  }]);
	
	  return Camera;
	}();
	
	var CameraState = exports.CameraState = function () {
	  function CameraState() {
	    _classCallCheck(this, CameraState);
	  }
	
	  _createClass(CameraState, null, [{
	    key: "read",
	    value: function read(reader, version) {
	      this.location = (0, _FileFormat.TisfatReadPointF)(reader, version);
	      this.scale = reader.ReadDouble();
	      this.angle = reader.ReadDouble();
	    }
	  }]);
	
	  return CameraState;
	}();

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Keyframe = __webpack_require__(17);
	
	var _Keyframe2 = _interopRequireDefault(_Keyframe);
	
	var _FileFormat = __webpack_require__(1);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Frameset = function () {
	  function Frameset() {
	    _classCallCheck(this, Frameset);
	
	    this.keyframes = [];
	  }
	
	  _createClass(Frameset, [{
	    key: "getStartTime",
	    value: function getStartTime() {
	      return this.keyframes[0].time;
	    }
	  }, {
	    key: "getEndTime",
	    value: function getEndTime() {
	      return this.keyframes[this.keyframes.length - 1].time;
	    }
	  }], [{
	    key: "read",
	    value: function read(reader, version) {
	      var frameset = new Frameset();
	      frameset.keyframes = (0, _FileFormat.TisfatReadList)(reader, version, _Keyframe2.default.read);
	      return frameset;
	    }
	  }]);
	
	  return Frameset;
	}();

	exports.default = Frameset;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _EntityIDs = __webpack_require__(6);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Keyframe = function () {
	  function Keyframe() {
	    _classCallCheck(this, Keyframe);
	
	    this.time = 0;
	    this.state = null;
	    this.interpMode = "Linear";
	  }
	
	  _createClass(Keyframe, null, [{
	    key: "read",
	    value: function read(reader, version) {
	      var keyframe = new Keyframe();
	      keyframe.time = reader.ReadUInt32();
	      var type = (0, _EntityIDs.TisfatResolveEntityStateID)(reader.ReadUInt16());
	      keyframe.interpMode = version >= 2 ? reader.ReadString() : "Linear";
	      keyframe.state = type.read(reader, version);
	      return keyframe;
	    }
	  }]);
	
	  return Keyframe;
	}();

	exports.default = Keyframe;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map