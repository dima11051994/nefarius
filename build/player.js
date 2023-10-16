"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Player_instances, _Player_coins, _Player_cards, _Player_inventions, _Player_spies, _Player_activeSpies, _Player_canPlaceSpy;
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const game_utils_1 = require("./utils/game-utils");
// TODO: Add player.d.ts to declare player class
class Player {
    constructor(user) {
        this.user = user;
        _Player_instances.add(this);
        // Current player's coins count
        _Player_coins.set(this, 0);
        _Player_cards.set(this, []);
        _Player_inventions.set(this, []);
        _Player_spies.set(this, 5);
        _Player_activeSpies.set(this, {
            [types_1.Action.ESPIONAGE]: 0,
            [types_1.Action.INVENTION]: 0,
            [types_1.Action.RESEARCH]: 0,
            [types_1.Action.JOB]: 0
        });
    }
    get coins() {
        return __classPrivateFieldGet(this, _Player_coins, "f");
    }
    get cards() {
        return __classPrivateFieldGet(this, _Player_cards, "f").length;
    }
    get inventions() {
        return __classPrivateFieldGet(this, _Player_inventions, "f");
    }
    get spies() {
        return __classPrivateFieldGet(this, _Player_spies, "f");
    }
    get activeSpies() {
        return __classPrivateFieldGet(this, _Player_activeSpies, "f");
    }
    get points() {
        return __classPrivateFieldGet(this, _Player_inventions, "f").reduce((sum, invention) => sum + this.calculateInventionPoints(invention), 0);
    }
    calculateInventionPoints(invention) {
        return invention.points +
            invention.effects
                .filter((effect) => effect.object === types_1.EffectObject.POINT)
                .reduce((sum, effect) => {
                let points = effect.count;
                switch (effect.delimiter) {
                    case types_1.EffectDelimiter.CARD:
                        points *= __classPrivateFieldGet(this, _Player_cards, "f").length;
                        break;
                    case types_1.EffectDelimiter.INVENTION:
                        points *= __classPrivateFieldGet(this, _Player_inventions, "f").length;
                        break;
                    case types_1.EffectDelimiter.SPY:
                        // Max spies count minus current available
                        points *= 5 - __classPrivateFieldGet(this, _Player_spies, "f");
                        break;
                }
                return effect.positive ? sum + points : sum - points;
            }, 0);
    }
    /**
     * Add coins to player.
     * Notify user by setting current number of coins after performing this operation.
     * @param coins {number} Number of coins to add
     */
    async addCoins(coins) {
        // Do nothing when nothing is added
        if (coins < 1) {
            return;
        }
        __classPrivateFieldSet(this, _Player_coins, __classPrivateFieldGet(this, _Player_coins, "f") + coins, "f");
        await this.user.setCoins(__classPrivateFieldGet(this, _Player_coins, "f"));
    }
    /**
     * Take coins from player. If player doesn't have enough coins to take, just take all coins.
     * Notify user by setting current number of coins after performing this operation.
     * @param coins {number} Number of coins to take
     */
    async takeCoins(coins) {
        // Do nothing when nothing is taken
        if (coins < 1) {
            return;
        }
        __classPrivateFieldSet(this, _Player_coins, __classPrivateFieldGet(this, _Player_coins, "f") >= coins ? __classPrivateFieldGet(this, _Player_coins, "f") - coins : 0, "f");
        await this.user.setCoins(__classPrivateFieldGet(this, _Player_coins, "f"));
    }
    /**
     * Add one or more cards to the player's deck. Notify user about the cards received
     * @param cards
     */
    async addCards(...cards) {
        __classPrivateFieldGet(this, _Player_cards, "f").push(...cards);
        await this.user.giveCards(cards);
    }
    /**
     * Take {count} from player's deck. Take all cards if count is more than player has.
     * Otherwise, let user choose which cards should be removed.
     * @param count {number} Number of cards to take
     */
    async takeCards(count) {
        // Player has no cards in deck, do nothing
        if (__classPrivateFieldGet(this, _Player_cards, "f").length === 0) {
            return [];
        }
        let takenCardIds = [];
        let takenCards = [];
        do {
            takenCardIds = await this.user.takeOffCards(count);
            // We can be sure that undefined values aren't possible as we are filtering them out
            takenCards = takenCardIds
                .map((id) => __classPrivateFieldGet(this, _Player_cards, "f").find((card) => card.id === id))
                .filter((card) => card);
        } while (takenCards.length !== takenCardIds.length);
        __classPrivateFieldSet(this, _Player_cards, __classPrivateFieldGet(this, _Player_cards, "f").filter((card) => takenCardIds.findIndex((id) => id === card.id) === -1), "f");
        return takenCards;
    }
    /**
     * Return public player statistics visible to other players
     */
    getStats() {
        return {
            coins: __classPrivateFieldGet(this, _Player_coins, "f"),
            inventions: __classPrivateFieldGet(this, _Player_inventions, "f"),
            points: this.points,
            activeSpies: __classPrivateFieldGet(this, _Player_activeSpies, "f")
        };
    }
    /**
     * Ask user for the next turn
     */
    async turn() {
        return await this.user.turn();
    }
    async processSpies(...actions) {
        const earned = actions.reduce((sum, action) => sum + __classPrivateFieldGet(this, _Player_activeSpies, "f")[action], 0);
        if (earned > 0) {
            await this.addCoins(earned);
        }
        return earned;
    }
    /**
     * Place spy to some field. Ask user for an action field where spy should be placed.
     * @param free {boolean} Specifies whether placement is free or costs some money. Usually, it is free due to invention effect.
     */
    async placeSpy(free = false) {
        // No spies left, do nothing
        if (__classPrivateFieldGet(this, _Player_spies, "f") === 0) {
            return;
        }
        let field;
        do {
            field = await this.user.placeSpy();
            // TODO: Notify user that previous spy is returned
        } while (!__classPrivateFieldGet(this, _Player_instances, "m", _Player_canPlaceSpy).call(this, field, free));
        __classPrivateFieldSet(this, _Player_spies, +__classPrivateFieldGet(this, _Player_spies, "f") - 1, "f");
        __classPrivateFieldGet(this, _Player_activeSpies, "f")[field]++;
        if (!free) {
            await this.takeCoins(game_utils_1.spyCost(field));
        }
        return field;
    }
    async returnSpy() {
        // No active spies, do nothing
        if (__classPrivateFieldGet(this, _Player_spies, "f") === 5) {
            return;
        }
        let field;
        do {
            field = await this.user.returnSpy();
        } while (__classPrivateFieldGet(this, _Player_activeSpies, "f")[field] === 0);
        __classPrivateFieldGet(this, _Player_activeSpies, "f")[field]--;
        __classPrivateFieldSet(this, _Player_spies, +__classPrivateFieldGet(this, _Player_spies, "f") + 1, "f");
    }
    /**
     * Invent a card that user selected. If card isn't present in the list of cards or can't be played, do nothing.
     * @param card {InventionCard} card to play
     * @returns Promise<InventionCard|undefined> played card or nothing if card wasn't played
     */
    async invent(card) {
        const cardIndex = __classPrivateFieldGet(this, _Player_cards, "f").findIndex((inventionCard) => inventionCard.id === card.id);
        // There is no such card, return
        if (cardIndex < 0) {
            return;
        }
        // Can't buy card, do nothing just return card to user
        if (__classPrivateFieldGet(this, _Player_coins, "f") < card.price) {
            await this.user.giveCards([card]);
            return;
        }
        __classPrivateFieldGet(this, _Player_cards, "f").splice(cardIndex, 1);
        __classPrivateFieldGet(this, _Player_inventions, "f").push(card);
        await this.takeCoins(card.price);
        return card;
    }
}
exports.default = Player;
_Player_coins = new WeakMap(), _Player_cards = new WeakMap(), _Player_inventions = new WeakMap(), _Player_spies = new WeakMap(), _Player_activeSpies = new WeakMap(), _Player_instances = new WeakSet(), _Player_canPlaceSpy = function _Player_canPlaceSpy(field, free) {
    return free || __classPrivateFieldGet(this, _Player_coins, "f") >= game_utils_1.spyCost(field);
};
//# sourceMappingURL=player.js.map