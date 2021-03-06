'use strict';
const mongoConnectionUrl = "mongodb://mongodb:27017/admin";
global.mongoClient = require('mongodb').MongoClient(mongoConnectionUrl);
const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'nodeserver'
    });

    await server.register(require('./myPlugin'));
    await mongoClient.connect();
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();