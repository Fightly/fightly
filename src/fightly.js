var Engine = require('./engine');
var Network = require('./network');


function createApplication() {
    var engine = new Engine();
    var network = new Network(engine);

    // Expose the Express app from the network module.
    engine.web = network.app;
    engine.network = network;

    return engine;
}

module.exports = createApplication;
