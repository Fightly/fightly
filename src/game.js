(function (module) {
"use strict";

var events = require('events');
var uuid = require('node-uuid');

var EntityManager = require('ensy');


class Game {
    constructor(id) {
        this.id = id;

        // An array of network clients taking part in this game.
        this._clients = [];

        this.listener = new events.EventEmitter();
        this.manager = new EntityManager(this.listener);

        this.listener.on('entityComponentUpdated', (entity, componentData) => {
            this.sendAll({data: entity});
        });
    }

    emitAll(type, data) {
        this._clients.forEach(client => {
            client.emit(type, data);
        });
    }

    addClient(client) {
        this._clients.push(client);
        this.emitAll('playerJoined', {});
    }

    toJSON() {
        return {
            id: this.id,
        };
    }
}

module.exports = Game;

})(module);
