(function (module) {
"use strict";

var io = require('socket.io');
var http = require('http');
var express = require('express');
var read = require('fs').readFileSync;

var clientSource = read(require.resolve('fightly-client/fightly.js'), 'utf-8');


class Client {
    constructor(socket, listener) {
        this.id = socket.id;
        this.socket = socket;
        this.listener = listener;

        this.socket.on('disconnect', this.onDisconnect.bind(this));

        this.socket.on('action', this.onAction.bind(this));
        this.socket.on('request', this.onDataRequest.bind(this));

        this.listener.emit('newPlayer', this);
    }

    emit(type, data) {
        console.log('Emitting data to a client: ' + type);
        data = JSON.stringify(data);
        this.socket.emit(type, data);
    }

    onAction(data) {
        console.log('Action');
        data = JSON.parse(data);
        this.listener.emit('action', { data, client: this });
    }

    onDataRequest(data) {
        console.log('Client is asking for data');
        data = JSON.parse(data);
        this.listener.emit('request', { data, client: this });
    }

    onDisconnect() {
        this.listener.emit('clientDisconnect', this);
    }
}


class Network {
    constructor(listener) {
        this.listener = listener;

        this.app = express();
        var server = http.Server(this.app);
        this.socket = io(server);

        this.app.get('/fightly/fightly.js', (req, res) => {
            res.set('Content-Type', 'application/javascript');
            res.send(clientSource);
        });

        this.socket.on('connection', this.onConnect.bind(this));

        server.listen(3000, function() {
            console.log('Listening on *:3000');
        });
    }

    onConnect(client) {
        console.log('New client connected - ' + client.id);
        var newClient = new Client(client, this.listener);
    }

    emitAll(type, data) {
        console.log('Emitting data to all clients: ' + type);
        data = JSON.stringify(data);
        this.socket.emit(type, data);
    }
}

module.exports = Network;

})(module);
