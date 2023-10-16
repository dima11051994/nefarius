"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleClient = void 0;
const readline_1 = __importDefault(require("readline"));
const types_1 = require("../../types");
class ConsoleClient {
    constructor() {
        this.money = 0;
        this.points = 0;
        this.cards = [];
        this.inventions = [];
        this.spies = 5;
        this.activeSpies = {
            [types_1.Action.ESPIONAGE]: 0,
            [types_1.Action.INVENTION]: 0,
            [types_1.Action.RESEARCH]: 0,
            [types_1.Action.JOB]: 0
        };
        this.waitingFunction = null;
        this.validAnswers = null;
        this.readlineInterface = readline_1.default.createInterface({ input: process.stdin, output: process.stdout });
        this.readlineInterface.on('line', this.handleLine.bind(this));
    }
    cancelPlaceSpy(action) {
        return Promise.resolve();
    }
    statistics(statistics) {
        return Promise.resolve();
    }
    handleLine(line) {
        if (this.waitingFunction === null || this.validAnswers === null) {
            return;
        }
        if (!this.validAnswers.includes(line)) {
            console.log(`Unrecognized answer: ${line}. Supported answers: ${this.validAnswers.join(', ')}`);
        }
        this.waitingFunction(line);
    }
    async waitForAnswer(validAnswers) {
        // Wait for another operation to complete
        while (this.waitingFunction !== null) {
            await this.sleep(1000);
        }
        return await new Promise((resolve) => {
            this.waitingFunction = (answer) => {
                this.waitingFunction = null;
                this.validAnswers = null;
                resolve(answer);
            };
            this.validAnswers = validAnswers;
        });
    }
    async sleep(ms) {
        return await new Promise((resolve) => {
            setTimeout(() => resolve(), ms);
        });
    }
    async giveCards(cards) {
        console.log('Received cards: ');
        for (const card of cards) {
            console.log(this.getCardMessage(card));
            this.cards.push(card);
        }
        return await Promise.resolve();
    }
    async returnSpy() {
        console.log('Select action from where to remove your spy:');
        const response = await this.waitForAnswer(['1', '2', '3', '4', 'ESPIONAGE', 'INVENTION', 'RESEARCH', 'JOB',
            'E', 'I', 'R', 'J']);
        switch (response) {
            case '1':
            case 'ESPIONAGE':
            case 'E':
                return types_1.Action.ESPIONAGE;
            case '2':
            case 'INVENTION':
            case 'I':
                return types_1.Action.INVENTION;
            case '3':
            case 'RESEARCH':
            case 'R':
                return types_1.Action.RESEARCH;
            case '4':
            case 'JOB':
            case 'J':
            default:
                return types_1.Action.JOB;
        }
    }
    async placeSpy() {
        console.log('Select action for your spy:');
        const response = await this.waitForAnswer(['1', '2', '3', '4', 'ESPIONAGE', 'INVENTION', 'RESEARCH', 'JOB',
            'E', 'I', 'R', 'J']);
        switch (response) {
            case '1':
            case 'ESPIONAGE':
            case 'E':
                return types_1.Action.ESPIONAGE;
            case '2':
            case 'INVENTION':
            case 'I':
                return types_1.Action.INVENTION;
            case '3':
            case 'RESEARCH':
            case 'R':
                return types_1.Action.RESEARCH;
            case '4':
            case 'JOB':
            case 'J':
            default:
                return types_1.Action.JOB;
        }
    }
    async setCoins(money) {
        console.log(`Now you have ${money} coin${money === 1 ? '' : 's'}`);
        this.money = money;
        return await Promise.resolve();
    }
    async takeOffCards(count) {
        console.log(`You need to take off ${count} card${count === 1 ? '' : 's'}`);
        if (this.cards.length <= count) {
            console.log('All your cards will be taken off');
            const result = this.cards.map((card) => card.id);
            this.cards = [];
            return result;
        }
        console.log('Your cards: ');
        for (const card of this.cards) {
            console.log(this.getCardMessage(card));
        }
        let removedCardIndexes = [];
        const validIndexes = [];
        for (let i = 0; i < this.cards.length; i++) {
            validIndexes.push((i + 1).toString());
        }
        for (let i = 0; i < Math.min(count, this.cards.length); i++) {
            console.log('Enter an index of card to remove: ');
            const index = parseInt(await this.waitForAnswer(validIndexes));
            if (removedCardIndexes.includes(index)) {
                console.log('Card is already chosen, choose another one: ');
                i--;
            }
        }
        const response = [];
        removedCardIndexes = removedCardIndexes.sort((a, b) => {
            if (a > b) {
                return -1;
            }
            if (a < b) {
                return 1;
            }
            return 0;
        });
        for (const index of removedCardIndexes) {
            response.push(this.cards[index - 1].id);
            this.cards.splice(index - 1, 1);
        }
        return Promise.resolve(response);
    }
    async turn() {
        console.log('Select action that you will perform:');
        let action;
        const response = await this.waitForAnswer(['1', '2', '3', '4', 'ESPIONAGE', 'INVENTION', 'RESEARCH', 'JOB',
            'E', 'I', 'R', 'J']);
        switch (response) {
            case '1':
            case 'ESPIONAGE':
            case 'E':
                action = types_1.Action.ESPIONAGE;
                break;
            case '2':
            case 'INVENTION':
            case 'I':
                action = types_1.Action.INVENTION;
                break;
            case '3':
            case 'RESEARCH':
            case 'R':
                action = types_1.Action.RESEARCH;
                break;
            case '4':
            case 'JOB':
            case 'J':
            default:
                action = types_1.Action.JOB;
                break;
        }
        const result = {
            action
        };
        if (action === types_1.Action.INVENTION) {
            console.log('Your cards: ');
            for (const card of this.cards) {
                console.log(this.getCardMessage(card));
            }
            const validIndexes = [];
            for (let i = 0; i < this.cards.length; i++) {
                validIndexes.push((i + 1).toString());
            }
            console.log('Enter an index of card to invent: ');
            const index = parseInt(await this.waitForAnswer(validIndexes));
            result.card = this.cards.splice(index - 1, 1)[0];
        }
        return result;
    }
    getCardMessage(card) {
        let result = `{ id: ${card.id}, points: ${card.points}, price: ${card.price}`;
        if (card.effects.length > 0) {
            result += `, effects: [${card.effects.map(this.getEffectMessage).join(', ')}]`;
        }
        return result;
    }
    getEffectMessage(effect) {
        let result = '{ ';
        result += effect.target === types_1.EffectTarget.SELF ? 'self' : 'others';
        result += effect.positive ? ' + ' : ' - ';
        result += effect.count.toString();
        switch (effect.object) {
            case types_1.EffectObject.CARD:
                result += ' card' + (effect.count === 1 ? '' : 's');
                break;
            case types_1.EffectObject.COIN:
                result += ' coin' + (effect.count === 1 ? '' : 's');
                break;
            case types_1.EffectObject.SPY:
                result += effect.count === 1 ? ' spy' : ' spies';
                break;
            case types_1.EffectObject.POINT:
                result += ' point' + (effect.count === 1 ? '' : 's');
                break;
        }
        if (effect.delimiter !== undefined) {
            result += ' / ';
            switch (effect.delimiter) {
                case types_1.EffectDelimiter.CARD:
                    result += 'card';
                    break;
                case types_1.EffectDelimiter.SPY:
                    result += 'spy';
                    break;
                case types_1.EffectDelimiter.INVENTION:
                    result += 'invention';
                    break;
            }
        }
        result += ' }';
        return result;
    }
}
exports.ConsoleClient = ConsoleClient;
//# sourceMappingURL=console.js.map