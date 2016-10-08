(function (module) {
"use strict";

var EventEmitter = require('events');
var path = require('path');
var uuid = require('node-uuid');

var Room = require('./room');


const MODULE_PATH = './modules';

class Engine extends EventEmitter {
    constructor(actions) {
        super();

        this.actions = actions;

        // An array of connected network clients.
        this._clients = [];

        // An array of rooms.
        this._rooms = [];

        this._components = [];
        this._processors = [];
        this._actions = [];

        this._modules = [];
        this._modules_dir = MODULE_PATH;

        this._setEventListeners();
    }

    _setEventListeners() {
        this.on('request', (request) => {
            console.log('data requested');
            switch (request.content.type) {
                case 'modules':
                    console.log('engine, asked for modules');
                    request.client.emit('data', { type: 'modules', data: this._modules });
                    break;
                case 'games':
                    console.log('engine, asked for games');
                    request.client.emit('data', { type: 'games', data: this._rooms });
                    break;
            }
        });

        this.on('action', action => {
            let actionMeta = {
                type: action.content.type,
                params: action.content.params,
                context: {
                    room: null,
                    client: action.client,
                },
            };
            console.log('engine, action received');
            switch (action.content.type) {
                case 'core.createGame':
                    var game = this.createGame();
                    game.addClient(action.client);
                    action.client.emit('gameJoined', { game });
                    break;
                case 'core.joinGame':
                    var game = this.getGame(action.content.game);
                    game.addClient(action.client);
                    action.client.emit('gameJoined', { game });
                    break;
                default:
                    this.actions.execute(actionMeta);
                    break;
            }
        })
    }

    setModulesDir(dir) {
        this._modules_dir = dir;
    }

    loadModule(name, module) {
        if (!module) {
            module = require(path.join(this._modules_dir, name, 'module'));
        }

        this._modules.push(name);

        this._components.push(...module.components);
        Object.keys(module.actions).forEach(key => {
            this.actions.add(name, key, module.actions[key]);
        });
    }

    createGame() {
        console.log('Create new game');
        let newGame = new Room(uuid.v4());
        this._rooms.push(newGame);

        this.network.emitAll('games', this._rooms);
        return newGame;
    }

    getGame(id) {
        return this._rooms.filter(game => {
            return game.id === id;
        })[0];
    }
}

module.exports = Engine;

})(module);
