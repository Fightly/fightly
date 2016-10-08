var Engine = require('./engine');
var Network = require('./network');
var Actions = require('./actions');


function createApplication() {
    var actions = new Actions();
    var engine = new Engine(actions);
    var network = new Network(engine);

    // Expose the Express app from the network module.
    engine.web = network.app;
    engine.network = network;

    return engine;
}

module.exports = createApplication;
