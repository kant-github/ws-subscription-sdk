"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const webSocketManager_1 = __importDefault(require("./webSocketManager"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const server = (0, http_1.createServer)(app);
new webSocketManager_1.default(server);
server.listen(8080, () => {
    console.log("app is listening at port 8080");
});
