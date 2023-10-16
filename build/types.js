"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawPhase = exports.Action = exports.EffectDelimiter = exports.EffectObject = exports.EffectTarget = void 0;
var EffectTarget;
(function (EffectTarget) {
    EffectTarget["SELF"] = "SELF";
    EffectTarget["OTHERS"] = "OTHERS";
})(EffectTarget = exports.EffectTarget || (exports.EffectTarget = {}));
var EffectObject;
(function (EffectObject) {
    EffectObject["COIN"] = "COIN";
    EffectObject["CARD"] = "CARD";
    EffectObject["SPY"] = "SPY";
    EffectObject["POINT"] = "POINT";
})(EffectObject = exports.EffectObject || (exports.EffectObject = {}));
var EffectDelimiter;
(function (EffectDelimiter) {
    EffectDelimiter["SPY"] = "SPY";
    EffectDelimiter["CARD"] = "CARD";
    EffectDelimiter["INVENTION"] = "INVENTION";
})(EffectDelimiter = exports.EffectDelimiter || (exports.EffectDelimiter = {}));
var Action;
(function (Action) {
    Action[Action["ESPIONAGE"] = 1] = "ESPIONAGE";
    Action[Action["INVENTION"] = 2] = "INVENTION";
    Action[Action["RESEARCH"] = 3] = "RESEARCH";
    Action[Action["JOB"] = 4] = "JOB";
})(Action = exports.Action || (exports.Action = {}));
var LawPhase;
(function (LawPhase) {
    LawPhase[LawPhase["BEFORE_START"] = 0] = "BEFORE_START";
    LawPhase[LawPhase["BEFORE_TURN"] = 1] = "BEFORE_TURN";
    LawPhase[LawPhase["ON_SPY_PROCESSION"] = 2] = "ON_SPY_PROCESSION";
    LawPhase[LawPhase["ON_ACTION_SELECT"] = 3] = "ON_ACTION_SELECT";
    LawPhase[LawPhase["AFTER_PLACING_SPY"] = 4] = "AFTER_PLACING_SPY";
    LawPhase[LawPhase["ON_INVENTION"] = 5] = "ON_INVENTION";
    LawPhase[LawPhase["AFTER_INVENTION"] = 6] = "AFTER_INVENTION";
    LawPhase[LawPhase["ON_RESEARCH"] = 7] = "ON_RESEARCH";
    LawPhase[LawPhase["AFTER_RESEARCH"] = 8] = "AFTER_RESEARCH";
    LawPhase[LawPhase["AFTER_TURN"] = 9] = "AFTER_TURN";
})(LawPhase = exports.LawPhase || (exports.LawPhase = {}));
//# sourceMappingURL=types.js.map