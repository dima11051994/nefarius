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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.SocketPlayer = exports.Method = exports.PlayerStatus = void 0;
const net = __importStar(require("net"));
const engine_1 = require("../engine");
const lodash_1 = __importDefault(require("lodash"));
var PlayerStatus;
(function (PlayerStatus) {
    PlayerStatus[PlayerStatus["REGISTERED"] = 0] = "REGISTERED";
    PlayerStatus[PlayerStatus["STARTED"] = 1] = "STARTED";
    PlayerStatus[PlayerStatus["ERROR"] = 2] = "ERROR";
})(PlayerStatus = exports.PlayerStatus || (exports.PlayerStatus = {}));
var Method;
(function (Method) {
    Method[Method["GIVE_CARDS"] = 0] = "GIVE_CARDS";
    Method[Method["TAKE_OFF_CARDS"] = 1] = "TAKE_OFF_CARDS";
    Method[Method["RETURN_SPY"] = 2] = "RETURN_SPY";
    Method[Method["SEND_SPY"] = 3] = "SEND_SPY";
    Method[Method["CANCEL_SEND_SPY"] = 4] = "CANCEL_SEND_SPY";
    Method[Method["SET_COINS"] = 5] = "SET_COINS";
    Method[Method["TURN"] = 6] = "TURN";
    Method[Method["STATS"] = 7] = "STATS";
})(Method = exports.Method || (exports.Method = {}));
class SocketPlayer {
    constructor(socket) {
        this.waitingFunction = null;
        this.pendingCommand = null;
        this.buffer = '';
        this.socket = socket;
        socket.on('data', (data) => this._socketDataHandler(data));
    }
    async cancelPlaceSpy(field) {
        return await Promise.resolve();
    }
    async statistics(stats) {
        return await Promise.resolve();
    }
    _socketDataHandler(chunk) {
        var _a;
        const data = this.buffer + chunk.toString();
        const messages = data.split('\r');
        if (messages.length === 1) {
            this.buffer = data;
        }
        else {
            this.buffer = (_a = messages.pop()) !== null && _a !== void 0 ? _a : '';
            if (this.pendingCommand === null) {
                return;
            }
            for (const messageStr of messages) {
                const message = JSON.parse(messageStr);
                if (message.method === this.pendingCommand && this.waitingFunction !== null) {
                    this.waitingFunction(message);
                }
            }
        }
    }
    async waitForAnswer(method) {
        // Wait for another operation to complete
        while (this.waitingFunction !== null) {
            await sleep(1000);
        }
        return await new Promise((resolve) => {
            this.waitingFunction = (answer) => {
                this.waitingFunction = null;
                this.pendingCommand = null;
                resolve(answer);
            };
            this.pendingCommand = method;
        });
    }
    async giveCards(cards) {
        await this.socket.write(JSON.stringify({ method: Method.GIVE_CARDS, cards: cards }) + '\r');
        await this.waitForAnswer(Method.GIVE_CARDS);
    }
    async returnSpy() {
        await this.socket.write(JSON.stringify({ method: Method.RETURN_SPY }) + '\r');
        let answer;
        do {
            answer = await this.waitForAnswer(Method.RETURN_SPY);
        } while (answer.action === undefined);
        return answer.action;
    }
    async placeSpy() {
        await this.socket.write(JSON.stringify({ method: Method.SEND_SPY }) + '\r');
        let answer;
        do {
            answer = await this.waitForAnswer(Method.SEND_SPY);
        } while (answer.action === undefined);
        return answer.action;
    }
    async setCoins(money) {
        await this.socket.write(JSON.stringify({ method: Method.SET_COINS, count: money }) + '\r');
        await this.waitForAnswer(Method.SET_COINS);
    }
    async takeOffCards(count) {
        await this.socket.write(JSON.stringify({ method: Method.TAKE_OFF_CARDS, count: count }) + '\r');
        let answer;
        do {
            answer = await this.waitForAnswer(Method.TAKE_OFF_CARDS);
        } while (answer.cardIds === undefined);
        return answer.cardIds;
    }
    async turn() {
        await this.socket.write(JSON.stringify({ method: Method.TURN }) + '\r');
        let answer;
        do {
            answer = await this.waitForAnswer(Method.TURN);
        } while (answer.turn === undefined);
        return answer.turn;
    }
}
exports.SocketPlayer = SocketPlayer;
const PORT = 11051;
const EXPECTED_PLAYERS = 2;
const players = [];
let engine;
async function main() {
    const server = net.createServer((socket) => {
        console.log('Connected new client');
        if (players.length >= EXPECTED_PLAYERS) {
            socket.write(JSON.stringify({ status: PlayerStatus.ERROR, message: 'This game is full' }) + '\r');
            socket.end();
        }
        else {
            players.push(new SocketPlayer(socket));
            socket.write(JSON.stringify({ status: PlayerStatus.REGISTERED, index: players.length - 1 }) + '\r');
        }
    });
    server.listen(PORT);
    while (players.length < EXPECTED_PLAYERS) {
        await sleep(1000);
    }
    for (const player of players) {
        player.socket.write(JSON.stringify({ status: PlayerStatus.STARTED }) + '\r');
    }
    engine = new engine_1.Engine(players);
    const winner = await engine.start();
    return lodash_1.default.findIndex(players, winner);
}
exports.main = main;
async function sleep(ms) {
    return await new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}
//# sourceMappingURL=socket-server-game.js.map