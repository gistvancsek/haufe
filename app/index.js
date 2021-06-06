'use strict';
const mongoConnectionUrl = "mongodb://mongodb:27017/users";
const mongoClient = new require('mongodb').MongoClient(mongoConnectionUrl);
const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'nodeserver'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello World!';
        }
    });

    server.route({
        method: 'GET',
        path: '/mongo-status',
        handler: (request, h) => {
            if(mongoClient.isConnected()){
                return 'MongoDB connected successfully!';
            }
            return 'MongoDB connected failed!'
        }
    });

    await mongoClient.connect();
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();