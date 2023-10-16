"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("./console");
const net = __importStar(require("net"));
const socket_server_game_1 = require("../socket-server-game");
const HOST = 'localhost';
const PORT = 11051;
const consoleClient = new console_1.ConsoleClient();
const socket = new net.Socket();
socket.on('error', (err) => console.error(err));
socket.on('close', () => console.error('closed'));
socket.on('connect', () => console.log('connected'));
socket.on('data', (data) => {
    socketDataHandler(data).catch(console.error);
});
socket.connect({
    host: HOST,
    port: PORT
});
let buffer = '';
async function socketDataHandler(chunk) {
    var _a;
    console.log(`Received chunk: ${chunk.toString()}`);
    const data = buffer + chunk.toString();
    const messages = data.split('\r');
    if (messages.length === 1) {
        buffer = data;
    }
    else {
        buffer = (_a = messages.pop()) !== null && _a !== void 0 ? _a : '';
        for (const messageStr of messages) {
            const message = JSON.parse(messageStr);
            await messageHandler(message);
        }
    }
}
async function messageHandler(message) {
    var _a, _b, _c;
    let answer;
    switch (message.method) {
        case socket_server_game_1.Method.GIVE_CARDS:
            await consoleClient.giveCards((_a = message.cards) !== null && _a !== void 0 ? _a : []);
            await socket.write(JSON.stringify({ method: socket_server_game_1.Method.GIVE_CARDS }) + '\r');
            break;
        case socket_server_game_1.Method.SET_COINS:
            await consoleClient.setCoins((_b = message.count) !== null && _b !== void 0 ? _b : 0);
            await socket.write(JSON.stringify({ method: socket_server_game_1.Method.SET_COINS }) + '\r');
            break;
        case socket_server_game_1.Method.RETURN_SPY:
            answer = await consoleClient.returnSpy();
            await socket.write(JSON.stringify({ method: socket_server_game_1.Method.RETURN_SPY, action: answer }) + '\r');
            break;
        case socket_server_game_1.Method.SEND_SPY:
            answer = await consoleClient.placeSpy();
            await socket.write(JSON.stringify({ method: socket_server_game_1.Method.SEND_SPY, action: answer }) + '\r');
            break;
        case socket_server_game_1.Method.TAKE_OFF_CARDS:
            answer = await consoleClient.takeOffCards((_c = message.count) !== null && _c !== void 0 ? _c : 0);
            await socket.write(JSON.stringify({ method: socket_server_game_1.Method.TAKE_OFF_CARDS, cardIds: answer }) + '\r');
            break;
        case socket_server_game_1.Method.TURN:
            answer = await consoleClient.turn();
            await socket.write(JSON.stringify({ method: socket_server_game_1.Method.TURN, turn: answer }) + '\r');
            break;
    }
}
//# sourceMappingURL=socket.js.map