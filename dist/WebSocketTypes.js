"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shapes = exports.WebSocketType = void 0;
var WebSocketType;
(function (WebSocketType) {
    WebSocketType["subscribe_channel"] = "subscribe_channel";
    WebSocketType["unsubscribe_channel"] = "unsubscribe_channel";
    WebSocketType["chat"] = "chat";
    WebSocketType["sketch"] = "sketch";
    WebSocketType["event"] = "event";
})(WebSocketType || (exports.WebSocketType = WebSocketType = {}));
var Shapes;
(function (Shapes) {
    Shapes["rect"] = "rect";
    Shapes["circle"] = "circle";
    Shapes["line"] = "line";
    Shapes["pencil"] = "pencil";
})(Shapes || (exports.Shapes = Shapes = {}));
