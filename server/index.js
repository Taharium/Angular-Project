const express = require('express'); //import express module
const app = express(); //create express app
const cors = require('cors'); //import cors module
const bodyParser = require('body-parser'); //import body-parser module
const crypto = require('node:crypto'); //import crypto module

let users = [
    { username: 'test@test.com', password: '12345678', authToken: null, highscore: '78' },
    { username: 'hello@hel.com', password: '12345678', authToken: null, highscore: '8' },
    { username: 'test@test.co', password: '12345678', authToken: null, highscore: '0' }
];

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());

function generateAuthToken() {
    let authToken = crypto.randomBytes(16).toString('hex')
    while(isAuthTokenTaken(authToken)) {
        authToken = crypto.randomBytes(16).toString('hex');
    }
    return authToken;
}

function isAuthTokenTaken(authToken) {
    return users.some(user => user.authToken === authToken);
}

function isUsernameTaken(username) {
    console.log(users);
    return users.some(user => user.username === username);
}

function getUserByUsername(username) {
    return users.find(user => user.username === username);
}

function updateUserAuthToken(userId, newAuthToken) {
    const user = users.find(user => user.id === userId);
    user.authToken = newAuthToken;
}

function createUser(username, password, authToken, highscore) {
    let newUser = {
        username: username,
        password: password,
        authToken: authToken,
        highscore: highscore
    };

    users.push(newUser);
}

app.delete('/sessions/:authToken', (req, res) => {
    const authToken = req.params.authToken;
    const userIndex = users.findIndex(user => user.authToken === authToken);

    if (userIndex !== -1) {
        // User found, remove the authentication token
        users[userIndex].authToken = null;

        res.send({ text: 'Logout successful' });
    } else {
        res.status(404).send({ text: 'User not found' });
    }
});

app.post('/login', (req, res) => {
    let x = req.body;
    console.log(x);
    const userIndex = users.findIndex(user => user.username === x.username && user.authToken !== null);

    const user = getUserByUsername(x.username);

    if (userIndex !== -1) {
        res.status(409).send({ text: 'User already logged in' });
    } else if (user === undefined) {
        res.status(401).send({ text: 'Invalid username or password' });
    } else if (user.password !== x.password) {
        res.status(401).send({ text: 'Invalid username or password' });
    } else {
        const authToken = generateAuthToken();
        updateUserAuthToken(user.id, authToken);
        res.send({ text: 'Login successful', authToken: authToken });
    }
});

app.post('/users', (req, res) => {
    let x = req.body;
    console.log(x);

    if (isUsernameTaken(x.username)) {
        res.status(409).send({ text: 'Username already taken' });
    } else {
        const authToken = generateAuthToken();
        createUser(x.username, x.password, authToken, 0);
        res.send({ text: 'User created successfully', authToken: authToken });
    }
})

app.get('/highscores/:authToken', (req, res) => {
    const authToken = req.params.authToken;
    const userIndex = users.findIndex(user => user.authToken === authToken);

    if (userIndex !== -1) {
        res.send({ text: 'Highscore retrieved', highscore: users[userIndex].highscore });
    } else {
        res.status(400).send({ text: 'User not found' });
    }
});

app.post('/highscores/:authToken', (req, res) => {
    const authToken = req.params.authToken;
    const x = req.body;
    const userIndex = users.findIndex(user => user.authToken === authToken);

    if (userIndex !== -1) {
        users[userIndex].highscore = x.highscore;
        res.send({ text: 'Highscore updated successfully' });
    } else {
        res.status(400).send({ text: 'User not found' });
    }
});

app.listen(3000, () => { //start a server on port 3000
    console.log('Example app listening at http://localhost:3000');
});