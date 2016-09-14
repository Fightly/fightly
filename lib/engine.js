(function (module) {
"use strict";

var EventEmitter = require('events');
var path = require('path');
var uuid = require('node-uuid');

var Game = require('./game');
var core = require('./core/module');


const MODULE_PATH = './modules';

class Engine extends EventEmitter {
    constructor() {
        super();

        // An array of connected network clients.
        this._clients = [];

        // An array of games.
        this._games = [];

        this._components = [];
        this._processors = [];
        this._actions = [];

        this._modules = [];
        this._modules_dir = MODULE_PATH;
        this.loadModule('core', core);

        this._setEventListeners();
    }

    _setEventListeners() {
        this.on('request', (request) => {
            console.log('data requested');
            switch (request.data.type) {
                case 'modules':
                    console.log('engine, asked for modules');
                    request.client.emit('data', { type: 'modules', data: this._modules });
                    break;
                case 'games':
                    console.log('engine, asked for games');
                    request.client.emit('data', { type: 'games', data: this._games });
                    break;
            }
        });

        this.on('action', (action) => {
            console.log('engine, action received');
            switch (action.data.type) {
                case 'createGame':
                    var game = this.createGame();
                    game.addClient(action.client);
                    action.client.emit('gameJoined', { game });
                    break;
                case 'joinGame':
                    console.log(action.data.game)
                    var game = this.getGame(action.data.game);
                    console.log(game);
                    game.addClient(action.client);
                    action.client.emit('gameJoined', { game });
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

        console.log(module);
        this._actions.push(...module.actions);
        this._components.push(...module.components);
        this._processors.push(...module.processors);
    }

    createGame() {
        console.log('Create new game');
        let newGame = new Game(uuid.v4());
        this._games.push(newGame);

        this.network.emitAll('games', this._games);
        return newGame;
    }

    getGame(id) {
        return this._games.filter(game => {
            return game.id === id;
        })[0];
    }
}

module.exports = Engine;

})(module);
