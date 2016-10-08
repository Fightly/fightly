(function (module) {
"use strict";

const Player = {
    name: 'Player',
    state: {},
};

const CORE = {
    actions: [
        'createGame',
        'joinGame',
        'leaveGame',
    ],
    components: [
        Player,
    ],
    processors: [],
};

module.exports = CORE;

})(module);
