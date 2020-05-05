/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./hat/eventFactory.ts":
/*!*****************************!*\
  !*** ./hat/eventFactory.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function eventFactory(type, payload) {
    return { type: type, payload: payload };
}
exports.default = eventFactory;


/***/ }),

/***/ "./hat/handler.ts":
/*!************************!*\
  !*** ./hat/handler.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var hat_1 = __webpack_require__(/*! ./hat */ "./hat/hat.ts");
var types_1 = __webpack_require__(/*! ./types */ "./hat/types.ts");
var eventFactory_1 = __webpack_require__(/*! ./eventFactory */ "./hat/eventFactory.ts");
var HatHandler = /** @class */ (function () {
    function HatHandler(io) {
        this.isHatOpen = false;
        this.time = 120; // seconds
        this.socketServer = io;
        this.hat = new hat_1.default();
        this.onConnection = this.onConnection.bind(this);
    }
    HatHandler.prototype.onConnection = function (socket) {
        var _this = this;
        socket.on('hat', function (event) { return _this.handleSocketEvent(socket, event); });
    };
    HatHandler.prototype.handleSocketEvent = function (socket, _a) {
        var type = _a.type, payload = _a.payload;
        console.log("[HAT:" + type + "] " + JSON.stringify(payload));
        switch (type) {
            case types_1.HatSocketClientEventEnum.PICK: {
                socket.broadcast.emit('hat', eventFactory_1.default(types_1.HatSocketServerEventEnum.WAIT));
                socket.emit('hat', eventFactory_1.default(types_1.HatSocketServerEventEnum.PICK, this.hat.getSubmission(socket.id)));
                break;
            }
            case types_1.HatSocketClientEventEnum.SUBMIT: {
                socket.broadcast.emit('hat', eventFactory_1.default(types_1.HatSocketServerEventEnum.SUBMISSION_RECEIVED));
                socket.emit('hat', eventFactory_1.default(types_1.HatSocketServerEventEnum.SUBMISSION_RECEIVED));
                this.hat.addSubmission(payload);
                break;
            }
            case types_1.HatSocketHatMasterClientEventEnum.RESET: {
                this.hat = new hat_1.default();
                socket.broadcast.emit('hat', eventFactory_1.default(types_1.HatSocketServerEventEnum.RESET));
                socket.emit('hat', eventFactory_1.default(types_1.HatSocketServerEventEnum.RESET));
                break;
            }
            case types_1.HatSocketHatMasterClientEventEnum.SET_THEME: {
                this.hat.theme = payload;
                socket.broadcast.emit('hat', eventFactory_1.default(types_1.HatSocketServerEventEnum.THEME_SET, payload));
                socket.emit('hat', eventFactory_1.default(types_1.HatSocketServerEventEnum.THEME_SET, payload));
                break;
            }
            case types_1.HatSocketHatMasterClientEventEnum.OPEN_HAT: {
                socket.broadcast.emit('hat', eventFactory_1.default(types_1.HatSocketServerEventEnum.HAT_OPENED));
                socket.emit('hat', eventFactory_1.default(types_1.HatSocketServerEventEnum.HAT_OPENED));
                break;
            }
            case types_1.HatSocketHatMasterClientEventEnum.CLOSE_HAT: {
                socket.broadcast.emit('hat', eventFactory_1.default(types_1.HatSocketServerEventEnum.HAT_CLOSED));
                socket.emit('hat', eventFactory_1.default(types_1.HatSocketServerEventEnum.HAT_CLOSED));
                break;
            }
            default: break;
        }
    };
    return HatHandler;
}());
exports.default = HatHandler;


/***/ }),

/***/ "./hat/hat.ts":
/*!********************!*\
  !*** ./hat/hat.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Hat = /** @class */ (function () {
    function Hat() {
        this.submissions = [];
    }
    Hat.prototype.addSubmission = function (submission) {
        console.log(submission);
        this.submissions.push(submission);
    };
    Hat.prototype.removeSubmission = function (index) {
        console.log(index);
        return this.submissions.splice(index, 1)[0];
    };
    Hat.prototype.getSubmission = function (forPlayer) {
        if (this.submissions.length === 0) {
            return false;
        }
        var index = this.submissions.findIndex(function (_a) {
            var author = _a.author;
            return author !== forPlayer;
        });
        if (index === -1) {
            index = 0;
        }
        return this.removeSubmission(index);
    };
    return Hat;
}());
exports.default = Hat;


/***/ }),

/***/ "./hat/types.ts":
/*!**********************!*\
  !*** ./hat/types.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var HatSocketClientEventEnum;
(function (HatSocketClientEventEnum) {
    HatSocketClientEventEnum["PICK"] = "PICK";
    HatSocketClientEventEnum["SUBMIT"] = "SUBMIT";
})(HatSocketClientEventEnum = exports.HatSocketClientEventEnum || (exports.HatSocketClientEventEnum = {}));
var HatSocketHatMasterClientEventEnum;
(function (HatSocketHatMasterClientEventEnum) {
    HatSocketHatMasterClientEventEnum["OPEN_HAT"] = "OPEN_HAT";
    HatSocketHatMasterClientEventEnum["CLOSE_HAT"] = "CLOSE_HAT";
    HatSocketHatMasterClientEventEnum["SET_THEME"] = "SET_THEME";
    HatSocketHatMasterClientEventEnum["SET_TIME"] = "SET_TIME";
    HatSocketHatMasterClientEventEnum["RESET"] = "RESET";
})(HatSocketHatMasterClientEventEnum = exports.HatSocketHatMasterClientEventEnum || (exports.HatSocketHatMasterClientEventEnum = {}));
var HatSocketServerEventEnum;
(function (HatSocketServerEventEnum) {
    HatSocketServerEventEnum["THEME_SET"] = "THEME_SET";
    HatSocketServerEventEnum["TIME_SET"] = "TIME_SET";
    HatSocketServerEventEnum["PICK"] = "PICK";
    HatSocketServerEventEnum["WAIT"] = "WAIT";
    HatSocketServerEventEnum["SUBMISSION_RECEIVED"] = "SUBMISSION_RECEIVED";
    HatSocketServerEventEnum["NO_SUBMISSIONS_LEFT"] = "NO_SUBMISSIONS_LEFT";
    HatSocketServerEventEnum["ERROR"] = "ERROR";
    HatSocketServerEventEnum["RESET"] = "RESET";
    HatSocketServerEventEnum["HAT_OPENED"] = "HAT_OPENED";
    HatSocketServerEventEnum["HAT_CLOSED"] = "HAT_CLOSED";
})(HatSocketServerEventEnum = exports.HatSocketServerEventEnum || (exports.HatSocketServerEventEnum = {}));
var HatSocketHatMasterServerEventEnum;
(function (HatSocketHatMasterServerEventEnum) {
})(HatSocketHatMasterServerEventEnum = exports.HatSocketHatMasterServerEventEnum || (exports.HatSocketHatMasterServerEventEnum = {}));


/***/ }),

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// modules
var http = __webpack_require__(/*! http */ "http");
var express = __webpack_require__(/*! express */ "express");
var socketIO = __webpack_require__(/*! socket.io */ "socket.io");
// servers
var app = express();
var server = http.createServer(app);
var io = socketIO(server, {
    path: '/virtual-hat/socket-io'
});
// handlers
var handler_1 = __webpack_require__(/*! ./players/handler */ "./players/handler.ts");
var handler_2 = __webpack_require__(/*! ./hat/handler */ "./hat/handler.ts");
var hh = new handler_2.default(io);
var ph = new handler_1.default(io);
io.on('connection', function (socket) {
    ph.onConnection(socket);
    hh.onConnection(socket);
});
app.get('/', function (_, res) {
    res.sendStatus(200);
});
var port = process.env.PORT || 3001;
server.listen(port, function () { return console.log("I'm listenin on " + port + "!"); });


/***/ }),

/***/ "./players/eventFactory.ts":
/*!*********************************!*\
  !*** ./players/eventFactory.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function eventFactory(type, payload) {
    return { type: type, payload: payload };
}
exports.default = eventFactory;


/***/ }),

/***/ "./players/handler.ts":
/*!****************************!*\
  !*** ./players/handler.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var player_1 = __webpack_require__(/*! ./player */ "./players/player.ts");
var types_1 = __webpack_require__(/*! ./types */ "./players/types.ts");
var eventFactory_1 = __webpack_require__(/*! ./eventFactory */ "./players/eventFactory.ts");
var eventFactory_2 = __webpack_require__(/*! ../hat/eventFactory */ "./hat/eventFactory.ts");
var types_2 = __webpack_require__(/*! ../hat/types */ "./hat/types.ts");
var PlayerHandler = /** @class */ (function () {
    function PlayerHandler(socketServer) {
        this.players = [];
        this.hatMaster = undefined;
        this.socketServer = socketServer;
        this.currentTurn = 0;
    }
    PlayerHandler.prototype.addPlayer = function (p) {
        console.log("Adding new player " + p.id);
        this.players.push(p);
        return true;
    };
    PlayerHandler.prototype.removePlayer = function (id) {
        console.log("Removing player " + id);
        var indexToRemove = this.players.findIndex(function (_a) {
            var _id = _a.id;
            return _id === id;
        });
        if (indexToRemove !== -1) {
            this.players.splice(indexToRemove, 1);
            if (this.hatMaster === id) {
                this.unsetHatMaster();
            }
            return true;
        }
        return false;
    };
    PlayerHandler.prototype.registerPlayer = function (id, nickname) {
        console.log("Registering player " + id + " to " + nickname);
        var nnIsTaken = this.players.find(function (_a) {
            var nn = _a.nickname;
            return nn === nickname;
        });
        if (!nnIsTaken) {
            var playerToRegister = this.players.find(function (_a) {
                var _id = _a.id;
                return _id === id;
            });
            if (playerToRegister) {
                playerToRegister.nickname = nickname;
                return true;
            }
            return false;
        }
        return false;
    };
    PlayerHandler.prototype.setHatMaster = function (socket) {
        this.hatMaster = socket.id;
        console.log("New hat master is " + this.hatMaster);
        socket.emit('player', eventFactory_1.default(types_1.PlayerSocketServerEventEnum.HAT_MASTER));
    };
    PlayerHandler.prototype.unsetHatMaster = function () {
        this.hatMaster = undefined;
        console.log("Removed hat master");
        if (this.players.length > 0) {
            this.setHatMaster(this.players[0].socket);
        }
    };
    // #region listener functions
    PlayerHandler.prototype.onConnection = function (socket) {
        var _this = this;
        socket.on('player', function (event) { return _this.handleSocketEvent(socket, event); });
        socket.on('disconnect', function () { return _this.removePlayer(socket.id); });
        var player = new player_1.default(socket);
        this.addPlayer(player);
    };
    PlayerHandler.prototype.handleSocketEvent = function (socket, _a) {
        var type = _a.type, payload = _a.payload;
        console.log("[PLAYER:" + type + "] " + JSON.stringify(payload));
        switch (type) {
            case types_1.PlayerSocketClientEventEnum.REGISTER:
                this.onRegister(socket, payload);
                break;
            case types_1.PlayerSocketClientEventEnum.NEXT_TURN:
                this.nextTurn(socket);
                break;
            default: break;
        }
    };
    PlayerHandler.prototype.nextTurn = function (socket) {
        var nextIndex = (this.currentTurn) % this.players.length;
        socket.emit('hat', eventFactory_2.default(types_2.HatSocketServerEventEnum.WAIT));
        socket.broadcast.emit('hat', eventFactory_2.default(types_2.HatSocketServerEventEnum.WAIT));
        this.players[nextIndex].socket.emit('player', eventFactory_1.default(types_1.PlayerSocketServerEventEnum.YOUR_PICK));
    };
    PlayerHandler.prototype.onRegister = function (socket, nickname) {
        var id = socket.id;
        var registered = this.registerPlayer(id, nickname);
        if (registered) {
            console.log("Registered player " + socket.id + " to " + nickname);
            socket.emit('player', eventFactory_1.default(types_1.PlayerSocketServerEventEnum.REGISTERED));
            if (this.hatMaster === undefined) {
                this.setHatMaster(socket);
            }
        }
        else {
            console.log(nickname + " is taken");
            socket.emit('player', eventFactory_1.default(types_1.PlayerSocketServerEventEnum.ERROR, { message: nickname + " is taken!" }));
        }
    };
    return PlayerHandler;
}());
exports.default = PlayerHandler;


/***/ }),

/***/ "./players/player.ts":
/*!***************************!*\
  !*** ./players/player.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Player = /** @class */ (function () {
    function Player(socket) {
        this._nickname = undefined;
        this.socket = socket;
        this._id = socket.id;
    }
    Object.defineProperty(Player.prototype, "nickname", {
        // #region accessors/mutators
        get: function () {
            return this._nickname;
        },
        set: function (n) {
            this._nickname = n;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.equals = function (other) {
        return this.id === other.id;
    };
    return Player;
}());
exports.default = Player;


/***/ }),

/***/ "./players/types.ts":
/*!**************************!*\
  !*** ./players/types.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PlayerSocketClientEventEnum;
(function (PlayerSocketClientEventEnum) {
    PlayerSocketClientEventEnum["REGISTER"] = "REGISTER";
    PlayerSocketClientEventEnum["NEXT_TURN"] = "NEXT_TURN";
})(PlayerSocketClientEventEnum = exports.PlayerSocketClientEventEnum || (exports.PlayerSocketClientEventEnum = {}));
var PlayerSocketServerEventEnum;
(function (PlayerSocketServerEventEnum) {
    PlayerSocketServerEventEnum["REGISTERED"] = "REGISTERED";
    PlayerSocketServerEventEnum["HAT_MASTER"] = "HAT_MASTER";
    PlayerSocketServerEventEnum["YOUR_PICK"] = "YOUR_PICK";
    PlayerSocketServerEventEnum["ERROR"] = "ERROR";
})(PlayerSocketServerEventEnum = exports.PlayerSocketServerEventEnum || (exports.PlayerSocketServerEventEnum = {}));


/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ })

/******/ });
//# sourceMappingURL=app.js.map