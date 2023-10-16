"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spyCost = void 0;
const types_1 = require("../types");
/**
 * Return number of coins to pay to place spy to a specific action field
 * @param action {Action} field where spy is going to be placed
 */
function spyCost(action) {
    switch (action) {
        case types_1.Action.ESPIONAGE:
        case types_1.Action.RESEARCH:
            return 0;
        case types_1.Action.JOB:
            return 1;
        case types_1.Action.INVENTION:
            return 2;
    }
}
exports.spyCost = spyCost;
//# sourceMappingURL=game-utils.js.map