(function (module) {
"use strict";

var events = require('events');
var uuid = require('node-uuid');

var EntityManager = require('ensy');


/**
 * A Room is a context for a game being played. It has a collection of clients
 * (players) and an independant Entity System manager.
 * A Room will send data to all its clients whenever the state changes.
 */
class Room {
    constructor(id) {
        this.id = id;

        // An array of network clients taking part in this game.
        this._clients = [];

        this.listener = new events.EventEmitter();
        this.manager = new EntityManager(this.listener);

        this.listener.on('entityComponentUpdated', (entity, componentData) => {
            this.emitAll({data: entity});
        });
    }

    emitAll(type, data) {
        this._clients.forEach(client => client.emit(type, data));
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

module.exports = Room;

})(module);
