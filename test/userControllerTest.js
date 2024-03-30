const assert = require("assert");
const { request } = require("http");
const http = require('http');


describe("POST /auth/loginClient", () => {
    describe("give a username and password", () => {
        // should save the username and password to the database 
        it("should respond with a 200 status code if user exist", async () => {
            const response = await makeLoginRequest("seydouf", "password");
            assert.strictEqual(response.statusCode, 200);
        });

        it("should specify json in the content type header", async () => {
            const response = await makeLoginRequest("seydou", "password");
            assert.ok(response.headers['content-type'].startsWith('application/json'));
        });

        it("should respond with a json object containing the user id", async () => {
            const response = await makeLoginRequest("seydou", "password");
            assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8');
            const responseBody = JSON.parse(response.body);
            assert.ok(responseBody && responseBody.client && responseBody.client.User && responseBody.client.User.id !== undefined, "La propriété 'id' n'a pas été trouvée dans la réponse JSON.");
        });

        it("should equal to 15", async () => {
            var result = 5*3;
            assert.equal(result, 15)
        });
        
    })

    describe("when the username and password are missing", () => {
        it("should respond with a 400 status code", async () => {
            const response = await makeLoginRequest("", "");
    
            assert.strictEqual(response.statusCode, 400);
        });
    });
})


async function makeLoginRequest(username,password) {
    const data = JSON.stringify({
        username: username,
        password: password,
    });

    const options = {
        hostname: '127.0.0.1', // Mettez ici l'adresse de votre serveur
        port: 5000, // Mettez ici le port de votre serveur
        path: '/auth/loginClient',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: responseData,
                });
            });
        });

        req.on('error', (error) => {
            reject({
                error: error,
            });
        });

        // Envoyez les données JSON avec la requête
        req.write(data);
        req.end();
    });
}