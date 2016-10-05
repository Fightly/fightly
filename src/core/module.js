(function (module) {
"use strict";

const Player = {
    name: 'Player',
    state: {},
};

class TurnProcessor {
    update(dt) {
        console.log('TurnProcessor.update()');
    }
}

const CORE = {
    actions: [
        'createGame',
        'joinGame',
        'leaveGame',
    ],
    components: [
        Player,
    ],
    processors: [
        TurnProcessor,
    ],
};

module.exports = CORE;

})(module);
