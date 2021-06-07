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
                    return h.response({statusCode: '200', message: 'MongoDB connected successfully!'}).code(200);
                } else {
                    return h.response({statusCode: '500', message: 'MongoDB connected failed!'}).code(500);
                }
            }
        });

        server.route({
            method: 'GET',
            path: '/',
            handler: (request, h) => {

                //TODO: se verifica starea userului si daca este autentifcation servim pagina cu meniu
                return `<div>
                        <form id="login" name="login">
                            <label for="email">Email address</label>
                            <input id="email" name="email"/> <br/>
                            <label for="password">Password</label>
                            <input id="password" name="password"/><br/>
                            <input type="submit" value="Login"/>
                        </form>
                    </div>
                    <script type="application/javascript">
                    var formFunc = function (event) {
                        event.preventDefault();
                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function () {
                            if (this.readyState == 4 && this.status == 200) {
                                    var xhttp = new XMLHttpRequest();
                                    xhttp.open("POST", "/", false);
                                    xhttp.setRequestHeader("Content-Type", "application/json");
                                    xhttp.send(JSON.stringify({ email: document.getElementById('email').value, password:document.getElementById('password').value}));
                            }
                        }
                        xhttp.open("GET", "/mongo-status", false);
                        xhttp.send();
                    };
                    var form = document.getElementById("login");
                    form.addEventListener("submit", formFunc, true);
                    </script>
                `;
            }
        });
        server.route({
            method: 'POST',
            path: '/',
            handler: (request, h) => {
                // se salveaza starea userului ca si autentificat si se face redirect pe /
                return h.response({statusCode: '200', message: ''}).code(200);
            }
        });
        server.route({
            method: 'GET',
            path: '/dummy-data',
            handler: async (request, h) => {
                const adminDb = mongoClient.db('admin');
                const usersCollection = adminDb.collection('users');
                const doc = {email: 'email_' + Math.floor(Math.random() * 999) + '@domain.com'};
                const result = await usersCollection.insertOne(doc);
                console.log(`Inserted document with _id: ${result.insertedId}`);
                if (result.insertedId !== 'undefined') {
                    return h.response({
                        statusCode: '200',
                        id: result.insertedId,
                        email: doc.email,
                        message: 'User inserted successfully'
                    }).code(200);
                } else {
                    return h.response({statusCode: '500', message: 'An error occurred'}).code(500);
                }
            }
        });

        server.route({
            method: 'GET',
            path: '/time-agg',
            handler: async (request, h) => {
                const adminDb = mongoClient.db('admin');
                const usersCollection = adminDb.collection('users');
                const dateStart = new Date();
                const pipeline = [{$match: {"email": /.+0.+/}}, {$sort: {_id: -1}}, {
                    $group: {
                        _id: null,
                        count: {$sum: 1}
                    }
                }]
                const aggCursor = await usersCollection.aggregate(pipeline);
                const dateStop = new Date();
                await aggCursor.forEach(entry => {
                    console.log(`Total documents which contains '0': ${entry.count}`);
                });
                return h.response({
                    statusCode: '200',
                    message: 'Agg took ' + (dateStop - dateStart) + ' ms'
                }).code(200);
            }
        });

    }
};