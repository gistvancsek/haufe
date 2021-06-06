'use strict';

exports.plugin = {
    name: 'myPlugin',
    version: '1.0.0',
    register: async function (server, options) {
        server.route({
            method: 'GET',
            path: '/mongo-status',
            handler: function (request, h) {
                if (mongoClient.isConnected()) {
                    return h.response({statusCode:'200', message: 'MongoDB connected successfully!'}).code(200);
                } else {
                    return h.response({statusCode:'500', message: 'MongoDB connected failed!'}).code(500);
                }
            }
        });
    }
};