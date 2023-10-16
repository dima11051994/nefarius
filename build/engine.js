"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Engine_instances, _Engine_players, _Engine_activeLaws, _Engine_activeDeck, _Engine_usedDeck, _Engine_options, _Engine_previousTurns, _Engine_distributeCards, _Engine_playRound, _Engine_playLawActions, _Engine_processSpies, _Engine_espionagePhase, _Engine_inventionPhase, _Engine_researchPhase, _Engine_jobPhase, _Engine_findWinner, _Engine_giveCardsToPlayer, _Engine_playEffect, _Engine_calculateEffectDelimiter, _Engine_playCoinEffect, _Engine_playCardEffect, _Engine_playSpyEffect, _Engine_initLaws;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
const deck_utils_1 = require("./utils/deck-utils");
const types_1 = require("./types");
const events_1 = __importDefault(require("events"));
const player_1 = __importDefault(require("./player"));
class Engine extends events_1.default {
    // TODO: Define necessary options
    constructor(users) {
        super();
        _Engine_instances.add(this);
        _Engine_players.set(this, void 0);
        _Engine_activeLaws.set(this, void 0);
        _Engine_activeDeck.set(this, void 0);
        _Engine_usedDeck.set(this, void 0);
        _Engine_options.set(this, void 0);
        // Turns that players selected in a previous round
        _Engine_previousTurns.set(this, void 0);
        __classPrivateFieldSet(this, _Engine_players, users.map((user) => new player_1.default(user)), "f");
        __classPrivateFieldSet(this, _Engine_options, {
            initialCoins: 10,
            initialCards: 3,
            researchCards: 1,
            researchCoins: 2,
            jobCoins: 4,
            winnerPoints: 20
        }, "f");
        __classPrivateFieldSet(this, _Engine_activeDeck, deck_utils_1.initCards(), "f");
        __classPrivateFieldSet(this, _Engine_usedDeck, [], "f");
        __classPrivateFieldSet(this, _Engine_activeLaws, [], "f");
        __classPrivateFieldSet(this, _Engine_previousTurns, [], "f");
    }
    async start() {
        __classPrivateFieldSet(this, _Engine_activeDeck, deck_utils_1.shuffle(__classPrivateFieldGet(this, _Engine_activeDeck, "f")), "f");
        __classPrivateFieldSet(this, _Engine_activeLaws, deck_utils_1.shuffle(__classPrivateFieldGet(this, _Engine_instances, "m", _Engine_initLaws).call(this)).slice(0, 2), "f");
        console.log(__classPrivateFieldGet(this, _Engine_activeLaws, "f"));
        // Play laws that affect core game settings
        await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_playLawActions).call(this, types_1.LawPhase.BEFORE_START);
        await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_distributeCards).call(this);
        const initialCoins = __classPrivateFieldGet(this, _Engine_options, "f").initialCoins;
        await Promise.all(__classPrivateFieldGet(this, _Engine_players, "f").map(async (player) => await player.addCoins(initialCoins)));
        let winner = null;
        do {
            this.emit('standings', this.getCurrentStandings());
            await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_playRound).call(this);
            winner = __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_findWinner).call(this);
        } while (winner == null);
        return winner;
    }
    getCurrentStandings() {
        return __classPrivateFieldGet(this, _Engine_players, "f").map((player) => player.getStats());
    }
}
exports.Engine = Engine;
_Engine_players = new WeakMap(), _Engine_activeLaws = new WeakMap(), _Engine_activeDeck = new WeakMap(), _Engine_usedDeck = new WeakMap(), _Engine_options = new WeakMap(), _Engine_previousTurns = new WeakMap(), _Engine_instances = new WeakSet(), _Engine_distributeCards = 
/**
 *
 * @private
 */
async function _Engine_distributeCards() {
    // Give initial invention cards to every player
    const initialCards = [];
    for (let i = 0; i < __classPrivateFieldGet(this, _Engine_options, "f").initialCards * __classPrivateFieldGet(this, _Engine_players, "f").length; i++) {
        // Go through every player and give one card at a time
        const card = __classPrivateFieldGet(this, _Engine_activeDeck, "f").pop();
        if (card !== undefined) {
            initialCards.push(card);
        }
    }
    // Distribute these cards to users
    await Promise.all(__classPrivateFieldGet(this, _Engine_players, "f").map(async (player, index) => await player.addCards(
    // Give every {ind} card to player {ind}
    ...initialCards.filter((value, cardIndex) => (cardIndex - index) % __classPrivateFieldGet(this, _Engine_players, "f").length === 0))));
}, _Engine_playRound = async function _Engine_playRound() {
    await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_playLawActions).call(this, types_1.LawPhase.BEFORE_TURN);
    const userTurns = await Promise.all(__classPrivateFieldGet(this, _Engine_players, "f").map(async (player) => await player.turn()));
    await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_playLawActions).call(this, types_1.LawPhase.ON_ACTION_SELECT, userTurns);
    this.emit('turn', userTurns);
    await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_processSpies).call(this, userTurns);
    await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_espionagePhase).call(this, userTurns);
    await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_inventionPhase).call(this, userTurns);
    await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_playLawActions).call(this, types_1.LawPhase.AFTER_INVENTION, userTurns);
    await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_researchPhase).call(this, userTurns);
    await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_playLawActions).call(this, types_1.LawPhase.AFTER_RESEARCH, userTurns);
    await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_jobPhase).call(this, userTurns);
    // Play law actions that affect end of a turn
    await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_playLawActions).call(this, types_1.LawPhase.AFTER_TURN, userTurns);
    __classPrivateFieldSet(this, _Engine_previousTurns, userTurns, "f");
}, _Engine_playLawActions = 
/**
 * Play law actions for the specific phase
 * @param phase Current game phase
 * @param turns User turns in the current round
 * @param player Current player instance
 * @private
 */
async function _Engine_playLawActions(phase, turns, player) {
    const actions = [];
    for (const law of __classPrivateFieldGet(this, _Engine_activeLaws, "f")) {
        actions.push(...(law.effects
            .filter((effect) => effect.phase === phase)
            .map((effect) => effect.action)));
    }
    for (const action of actions) {
        await action(turns, player);
    }
}, _Engine_processSpies = 
/**
 * Process current spies
 * @private
 */
async function _Engine_processSpies(turns) {
    await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_playLawActions).call(this, types_1.LawPhase.ON_SPY_PROCESSION, turns);
    await Promise.all(__classPrivateFieldGet(this, _Engine_players, "f").map(async (player, index) => {
        const leftPlayerAction = turns[index === 0 ? turns.length - 1 : index - 1].action;
        const rightPlayerAction = turns[index === turns.length - 1 ? 0 : index + 1].action;
        // Earn 1 coin per each spy sitting on the action of player's neighbours
        const coinsEarned = await player.processSpies(leftPlayerAction, rightPlayerAction);
        this.emit('spy.earn', index, coinsEarned);
    }));
}, _Engine_espionagePhase = 
/**
 * Process espionage action for all who played it
 * @param userTurns {Array<Turn>} List of user turns
 * @private
 */
async function _Engine_espionagePhase(userTurns) {
    await Promise.all(userTurns.map(async (turn, index) => {
        if (userTurns[index].action !== types_1.Action.ESPIONAGE) {
            return;
        }
        const action = await __classPrivateFieldGet(this, _Engine_players, "f")[index].placeSpy();
        if (action === undefined) {
            this.emit('spies.over', index);
        }
        this.emit('espionage', index);
        await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_playLawActions).call(this, types_1.LawPhase.AFTER_PLACING_SPY, userTurns, __classPrivateFieldGet(this, _Engine_players, "f")[index]);
    }));
}, _Engine_inventionPhase = async function _Engine_inventionPhase(userTurns) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const inventions = await Promise.all(userTurns.map(async (turn, index) => {
        if (userTurns[index].action !== types_1.Action.INVENTION || turn.card === undefined) {
            return;
        }
        const inventedCard = await __classPrivateFieldGet(this, _Engine_players, "f")[index].invent(turn.card);
        if (inventedCard !== undefined) {
            userTurns[index].metadata = Object.assign({}, userTurns[index].metadata, { successful: true });
        }
        return inventedCard;
    }));
    // If at least one person successfully played invention card, run invention-related law effects
    if (inventions.filter((invention) => invention !== undefined).length > 0) {
        await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_playLawActions).call(this, types_1.LawPhase.ON_INVENTION, userTurns);
    }
    for (let i = 0; i < __classPrivateFieldGet(this, _Engine_players, "f").length; i++) {
        const effects = ((_f = (_d = (_c = (_b = (_a = userTurns[i]) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.modifiedCard) === null || _c === void 0 ? void 0 : _c.effects) !== null && _d !== void 0 ? _d : (_e = inventions[i]) === null || _e === void 0 ? void 0 : _e.effects) !== null && _f !== void 0 ? _f : [])
            .filter((effect) => effect.target === types_1.EffectTarget.SELF);
        // iterate through other's played cards, add effects with target `others`
        let j = i + 1;
        do {
            // Check turn metadata: some laws may modify card, and we need to use card from metadata first
            effects.push(...(((_m = (_k = (_j = (_h = (_g = userTurns[j]) === null || _g === void 0 ? void 0 : _g.metadata) === null || _h === void 0 ? void 0 : _h.modifiedCard) === null || _j === void 0 ? void 0 : _j.effects) !== null && _k !== void 0 ? _k : (_l = inventions[j]) === null || _l === void 0 ? void 0 : _l.effects) !== null && _m !== void 0 ? _m : [])
                .filter((effect) => effect.target === types_1.EffectTarget.OTHERS)));
            j++;
            // Start from the beginning as it is a circle of players
            if (j >= __classPrivateFieldGet(this, _Engine_players, "f").length) {
                j = 0;
            }
        } while (j !== i);
        for (const effect of effects) {
            await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_playEffect).call(this, __classPrivateFieldGet(this, _Engine_players, "f")[i], effect);
        }
    }
}, _Engine_researchPhase = async function _Engine_researchPhase(userTurns) {
    await Promise.all(userTurns.map(async (turn, index) => {
        if (userTurns[index].action !== types_1.Action.RESEARCH) {
            return;
        }
        await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_giveCardsToPlayer).call(this, __classPrivateFieldGet(this, _Engine_players, "f")[index], __classPrivateFieldGet(this, _Engine_options, "f").researchCards);
        await __classPrivateFieldGet(this, _Engine_players, "f")[index].addCoins(__classPrivateFieldGet(this, _Engine_options, "f").researchCoins);
        this.emit('research', index);
    }));
}, _Engine_jobPhase = async function _Engine_jobPhase(userTurns) {
    await Promise.all(userTurns.map(async (turn, index) => {
        if (userTurns[index].action !== types_1.Action.JOB) {
            return;
        }
        await __classPrivateFieldGet(this, _Engine_players, "f")[index].addCoins(__classPrivateFieldGet(this, _Engine_options, "f").jobCoins);
        this.emit('job', index);
    }));
}, _Engine_findWinner = function _Engine_findWinner() {
    const winnerCandidates = __classPrivateFieldGet(this, _Engine_players, "f")
        .filter((player) => player.points >= __classPrivateFieldGet(this, _Engine_options, "f").winnerPoints)
        .sort((a, b) => {
        if (a.points > b.points) {
            return -1;
        }
        if (a.points < b.points) {
            return 1;
        }
        // TODO: are we checking this?
        if (a.inventions.length > b.inventions.length) {
            return -1;
        }
        if (a.inventions.length < b.inventions.length) {
            return 1;
        }
        return 0;
    });
    if (winnerCandidates.length > 0) {
        return winnerCandidates[0].user;
    }
    return null;
}, _Engine_giveCardsToPlayer = 
/**
 * Give to user the specified number of cards from the deck.
 * If deck becomes empty, get used cards deck, shuffle and continue
 * @param player {Player} Player instance
 * @param count {Number} How many cards to give
 * @private
 */
async function _Engine_giveCardsToPlayer(player, count) {
    const cards = [];
    for (let i = 0; i < count; i++) {
        let card = __classPrivateFieldGet(this, _Engine_activeDeck, "f").pop();
        if (card !== undefined) {
            cards.push(card);
        }
        else {
            __classPrivateFieldSet(this, _Engine_activeDeck, deck_utils_1.shuffle(__classPrivateFieldGet(this, _Engine_usedDeck, "f")), "f");
            __classPrivateFieldSet(this, _Engine_usedDeck, [], "f");
            card = __classPrivateFieldGet(this, _Engine_activeDeck, "f").pop();
            if (card !== undefined) {
                cards.push(card);
            }
            else {
                this.emit('emptyDeck');
                break;
            }
        }
    }
    await player.addCards(...cards);
}, _Engine_playEffect = async function _Engine_playEffect(player, effect) {
    const delimiter = __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_calculateEffectDelimiter).call(this, effect.delimiter, player);
    const count = delimiter * effect.count;
    switch (effect.object) {
        case types_1.EffectObject.COIN:
            await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_playCoinEffect).call(this, effect.positive, count, player);
            break;
        case types_1.EffectObject.CARD:
            await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_playCardEffect).call(this, effect.positive, count, player);
            break;
        case types_1.EffectObject.SPY:
            await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_playSpyEffect).call(this, effect.positive, count, player);
            break;
    }
}, _Engine_calculateEffectDelimiter = function _Engine_calculateEffectDelimiter(delimiter, player) {
    switch (delimiter) {
        case types_1.EffectDelimiter.SPY:
            return 5 - player.spies;
        case types_1.EffectDelimiter.CARD:
            return player.cards;
        case types_1.EffectDelimiter.INVENTION:
            return player.inventions.length;
        // Default case is when there is no delimiter
        default:
            return 1;
    }
}, _Engine_playCoinEffect = 
/**
 * Play invention effect for coins. Add or take {count} coins.
 * @param positive {boolean} Add coins if true, take otherwise
 * @param count {number}
 * @param player {Player}
 * @private
 */
async function _Engine_playCoinEffect(positive, count, player) {
    return await (positive ? player.addCoins(count) : player.takeCoins(count));
}, _Engine_playCardEffect = 
/**
 * Play invention effect for cards. Add or take {count} cards.
 * @param positive {boolean} Add coins if true, take otherwise
 * @param count {number}
 * @param player {Player}
 * @private
 */
async function _Engine_playCardEffect(positive, count, player) {
    if (positive) {
        await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_giveCardsToPlayer).call(this, player, count);
    }
    else {
        const takenOffCards = await player.takeCards(count);
        __classPrivateFieldGet(this, _Engine_usedDeck, "f").push(...takenOffCards);
    }
}, _Engine_playSpyEffect = async function _Engine_playSpyEffect(positive, count, player) {
    for (let i = 0; i < count; i++) {
        const field = await (positive ? player.placeSpy(true) : player.returnSpy());
        // Can't place or return spy, do nothing further
        if (field === undefined) {
            break;
        }
        // If player placed a spy, play related law effects
        if (positive) {
            await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_playLawActions).call(this, types_1.LawPhase.AFTER_PLACING_SPY, undefined, player);
        }
    }
}, _Engine_initLaws = function _Engine_initLaws() {
    return [
        {
            id: 'ALIEN_CONTACTS',
            effects: [
                {
                    phase: types_1.LawPhase.AFTER_TURN,
                    action: async (turns) => {
                        var _a;
                        // If turns were not specified, do nothing - but it is an error case
                        if (turns === undefined) {
                            return;
                        }
                        for (let i = 0; i < turns.length; i++) {
                            // For every player who played invention, throw away all invention cards and give new
                            if (((_a = turns[i]) === null || _a === void 0 ? void 0 : _a.action) === types_1.Action.INVENTION) {
                                const count = __classPrivateFieldGet(this, _Engine_players, "f")[i].cards;
                                await __classPrivateFieldGet(this, _Engine_players, "f")[i].takeCards(count);
                                await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_giveCardsToPlayer).call(this, __classPrivateFieldGet(this, _Engine_players, "f")[i], count);
                            }
                        }
                    }
                }
            ]
        },
        {
            id: 'FIRE_WATER_WHITE_MOUSE',
            effects: [
                {
                    phase: types_1.LawPhase.BEFORE_START,
                    // Job action gives your 6 coins instead of 4
                    action: async () => {
                        __classPrivateFieldGet(this, _Engine_options, "f").jobCoins = 6;
                    }
                }
            ]
        },
        {
            id: 'TWO_CARROTS_METHOD',
            effects: [
                {
                    phase: types_1.LawPhase.AFTER_RESEARCH,
                    action: async (turns) => {
                        var _a;
                        // If turns were not specified, do nothing - but it is an error case
                        if (turns === undefined) {
                            return;
                        }
                        for (let i = 0; i < turns.length; i++) {
                            // For every player who played research, give this player one more card but then take one
                            if (((_a = turns[i]) === null || _a === void 0 ? void 0 : _a.action) === types_1.Action.RESEARCH) {
                                await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_giveCardsToPlayer).call(this, __classPrivateFieldGet(this, _Engine_players, "f")[i], 1);
                                await __classPrivateFieldGet(this, _Engine_players, "f")[i].takeCards(1);
                            }
                        }
                    }
                }
            ]
        },
        {
            id: 'BORING_ERA',
            effects: [
                {
                    phase: types_1.LawPhase.ON_ACTION_SELECT,
                    action: async (turns) => {
                        // If turns were not specified, do nothing - but it is an error case
                        if (turns === undefined) {
                            return;
                        }
                        // If it is the first round, do nothing
                        if (__classPrivateFieldGet(this, _Engine_previousTurns, "f").length === 0) {
                            return;
                        }
                        // Force user to choose action not equal to a previous turn
                        await Promise.all(turns.map(async (turn, index) => {
                            let currentTurn = turn;
                            while (currentTurn.action === __classPrivateFieldGet(this, _Engine_previousTurns, "f")[index].action) {
                                currentTurn = await __classPrivateFieldGet(this, _Engine_players, "f")[index].turn();
                            }
                            // Modify turn as law may not allow some actions
                            turns[index] = currentTurn;
                        }));
                    }
                }
            ]
        },
        {
            id: 'SCIENTIFIC_RACE',
            effects: [
                {
                    phase: types_1.LawPhase.AFTER_INVENTION,
                    action: async (turns) => {
                        // If turns were not specified, do nothing - but it is an error case
                        if (turns === undefined) {
                            return;
                        }
                        for (let i = 0; i < turns.length; i++) {
                            /*
                            For every player who played invention, check if that invention gave user more points than any other
                            previously played. If so, give user 2 coins
                            */
                            const turn = turns[i];
                            if ((turn === null || turn === void 0 ? void 0 : turn.card) !== undefined && turn.action === types_1.Action.INVENTION) {
                                const pointsGave = __classPrivateFieldGet(this, _Engine_players, "f")[i].calculateInventionPoints(turn.card);
                                let isBiggest = true;
                                for (const invention of __classPrivateFieldGet(this, _Engine_players, "f")[i].inventions) {
                                    if (invention.id !== turn.card.id && __classPrivateFieldGet(this, _Engine_players, "f")[i].calculateInventionPoints(invention) >= pointsGave) {
                                        isBiggest = false;
                                        break;
                                    }
                                }
                                if (isBiggest) {
                                    await __classPrivateFieldGet(this, _Engine_players, "f")[i].addCoins(2);
                                }
                            }
                        }
                    }
                }
            ]
        },
        {
            id: 'PAY_OFFS',
            effects: [
                {
                    phase: types_1.LawPhase.BEFORE_TURN,
                    action: async () => {
                        for (const player of __classPrivateFieldGet(this, _Engine_players, "f")) {
                            // At the beginning of the round, if player has more than 5 coins, take coins to leave player with number divided by 5
                            if (player.coins > 5) {
                                await player.takeCoins(player.coins % 5);
                            }
                        }
                    }
                }
            ]
        },
        {
            id: 'GRANTS',
            effects: [
                {
                    phase: types_1.LawPhase.BEFORE_TURN,
                    action: async () => {
                        for (const player of __classPrivateFieldGet(this, _Engine_players, "f")) {
                            // If player has no inventions, give 2 coins
                            if (player.inventions.length === 0) {
                                await player.addCoins(2);
                            }
                        }
                    }
                }
            ]
        },
        {
            id: 'ANIMAL_RIGHTS_PROTECTION',
            effects: [
                {
                    phase: types_1.LawPhase.BEFORE_START,
                    action: async () => {
                        __classPrivateFieldGet(this, _Engine_options, "f").researchCoins = 0;
                    }
                }
            ]
        },
        {
            id: 'CHEAP_NUCLEAR_ENERGY',
            effects: [
                {
                    phase: types_1.LawPhase.BEFORE_START,
                    action: async () => {
                        // All inventions cost twice less (rounding up)
                        for (const card of __classPrivateFieldGet(this, _Engine_activeDeck, "f")) {
                            card.price = Math.round(card.price / 2);
                        }
                    }
                }
            ]
        },
        {
            id: 'SCIENTIFIC_MARATHON',
            effects: [
                {
                    phase: types_1.LawPhase.BEFORE_START,
                    action: async () => {
                        // Need to reach 30 points to win
                        __classPrivateFieldGet(this, _Engine_options, "f").winnerPoints = 30;
                    }
                }
            ]
        },
        {
            id: 'DELAYED_EFFECT',
            effects: [
                {
                    phase: types_1.LawPhase.ON_INVENTION,
                    action: async (turns) => {
                        // If turns were not specified, do nothing - but it is an error case
                        if (turns === undefined) {
                            return;
                        }
                        for (let i = 0; i < turns.length; i++) {
                            const turn = turns[i];
                            // If user plays invention card without effects, assign effect from a previously invented card
                            if (turn.action === types_1.Action.INVENTION && (turn === null || turn === void 0 ? void 0 : turn.card) !== undefined && (turn === null || turn === void 0 ? void 0 : turn.card.effects.length) === 0) {
                                let previousEffects = [];
                                for (let j = __classPrivateFieldGet(this, _Engine_players, "f")[i].inventions.length - 1; j >= 0; j++) {
                                    if (__classPrivateFieldGet(this, _Engine_players, "f")[i].inventions[j].effects.length >= 0) {
                                        previousEffects = __classPrivateFieldGet(this, _Engine_players, "f")[i].inventions[j].effects;
                                        break;
                                    }
                                }
                                if (turn.metadata === undefined) {
                                    turn.metadata = {};
                                }
                                turn.metadata.modifiedCard = Object.assign({}, turn.card, { effects: previousEffects });
                            }
                        }
                    }
                }
            ]
        },
        {
            id: 'FREE_SCIENTISTS_RADIO',
            effects: [
                {
                    phase: types_1.LawPhase.BEFORE_TURN,
                    action: async () => {
                        // At the beginning of the round, give every player 2 coins
                        for (const player of __classPrivateFieldGet(this, _Engine_players, "f")) {
                            await player.addCoins(2);
                        }
                    }
                }
            ]
        },
        {
            id: 'GAME_THEORY',
            effects: [
                {
                    phase: types_1.LawPhase.ON_SPY_PROCESSION,
                    action: async (turns) => {
                        // If turns were not specified, do nothing - but it is an error case
                        if (turns === undefined) {
                            return;
                        }
                        for (let i = 0; i < turns.length; i++) {
                            // Every player who played Research in this round should get twice more coins from spies.
                            // To achieve this, simply rerun the same logic for spies processing for this user
                            if (turns[i].action === types_1.Action.RESEARCH) {
                                const leftPlayerAction = turns[i === 0 ? turns.length - 1 : i - 1].action;
                                const rightPlayerAction = turns[i === turns.length - 1 ? 0 : i + 1].action;
                                // Earn 1 coin per each spy sitting on the action of player's neighbours
                                await __classPrivateFieldGet(this, _Engine_players, "f")[i].processSpies(leftPlayerAction, rightPlayerAction);
                            }
                        }
                    }
                }
            ]
        },
        {
            id: 'INSIDES',
            effects: [
                {
                    phase: types_1.LawPhase.ON_SPY_PROCESSION,
                    action: async (turns) => {
                        // If turns were not specified, do nothing - but it is an error case
                        if (turns === undefined) {
                            return;
                        }
                        for (let i = 0; i < turns.length; i++) {
                            // Every player gets coins from spies on the played action
                            await __classPrivateFieldGet(this, _Engine_players, "f")[i].processSpies(turns[i].action);
                        }
                    }
                }
            ]
        },
        {
            id: 'ACADEMICS',
            effects: [
                {
                    phase: types_1.LawPhase.AFTER_PLACING_SPY,
                    action: async (turns, player) => {
                        if (player === undefined) {
                            return;
                        }
                        // After placing a spy on the field (no matter because of what), an invention card should be given
                        await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_giveCardsToPlayer).call(this, player, 1);
                    }
                }
            ]
        },
        {
            id: 'ANCIENT_FORECASTS',
            effects: [
                {
                    phase: types_1.LawPhase.AFTER_RESEARCH,
                    action: async (turns) => {
                        // If turns were not specified, do nothing - but it is an error case
                        if (turns === undefined) {
                            return;
                        }
                        for (let i = 0; i < turns.length; i++) {
                            // On research, give user one more invention card
                            if (turns[i].action === types_1.Action.RESEARCH) {
                                await __classPrivateFieldGet(this, _Engine_instances, "m", _Engine_giveCardsToPlayer).call(this, __classPrivateFieldGet(this, _Engine_players, "f")[i], 1);
                            }
                        }
                    }
                },
                {
                    phase: types_1.LawPhase.AFTER_INVENTION,
                    action: async (turns) => {
                        var _a;
                        // If turns were not specified, do nothing - but it is an error case
                        if (turns === undefined) {
                            return;
                        }
                        for (let i = 0; i < turns.length; i++) {
                            // On invention - take one more invention card from user
                            if (turns[i].action === types_1.Action.INVENTION && ((_a = turns[i].metadata) === null || _a === void 0 ? void 0 : _a.successful) === true) {
                                await __classPrivateFieldGet(this, _Engine_players, "f")[i].takeCards(1);
                            }
                        }
                    }
                }
            ]
        },
        {
            id: 'HYPER_INFLATION',
            effects: [
                {
                    phase: types_1.LawPhase.AFTER_INVENTION,
                    action: async (turns) => {
                        var _a;
                        // If turns were not specified, do nothing - but it is an error case
                        if (turns === undefined) {
                            return;
                        }
                        for (let i = 0; i < turns.length; i++) {
                            // After invention player loses all coins
                            if (turns[i].action === types_1.Action.INVENTION && ((_a = turns[i].metadata) === null || _a === void 0 ? void 0 : _a.successful) === true) {
                                await __classPrivateFieldGet(this, _Engine_players, "f")[i].takeCoins(__classPrivateFieldGet(this, _Engine_players, "f")[i].coins);
                            }
                        }
                    }
                }
            ]
        }
    ];
};
//# sourceMappingURL=engine.js.map