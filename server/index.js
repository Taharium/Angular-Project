const express = require('express'); //import express module
const app = express(); //create express app
const cors = require('cors'); //import cors module
const bodyParser = require('body-parser'); //import body-parser module
const crypto = require('node:crypto'); //import crypto module
const bcrypt = require('bcryptjs'); //import bcrypt module
const mongoose = require('mongoose'); //import mongoose module

let users = [
    { username: 'test@test.com', password: '$2a$10$.Z5be.XRjDDIbqJfXYPeW.5k.x2LJNPuwmqy6JbiL3FhiImmxgEEu', authToken: null, highscore: '78' },
    { username: 'hello@hel.com', password: '$2a$10$.Z5be.XRjDDIbqJfXYPeW.5k.x2LJNPuwmqy6JbiL3FhiImmxgEEu', authToken: null, highscore: '8' },
    { username: 'test@test.co', password: '$2a$10$.Z5be.XRjDDIbqJfXYPeW.5k.x2LJNPuwmqy6JbiL3FhiImmxgEEu', authToken: null, highscore: '0' }
];

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());


(async function () {
    try {
            mongoose.connect('mongodb://localhost:27017/highscore', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }
})();


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

function updateUserAuthToken(username, newAuthToken) {
    const user = users.find(user => user.username === username);
    user.authToken = newAuthToken;
}

function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

function comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

function createUser(username, password, authToken, highscore) {
    let hash  = hashPassword(password);
    let newUser = {
        username: username,
        password: hash,
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

        res.send({ success: 'Logout successful' });
    } else {
        res.status(404).send({ massage: 'User not found' });
    }
});

app.get('/sessions/:authToken', (req, res) => {
    const authToken = req.params.authToken;
    const userIndex = users.findIndex(user => user.authToken === authToken);

    if (userIndex !== -1) {
        // User found, remove the authentication token
        res.send({ success: 'Valid user' });
    } else {
        res.status(404).send({ massage: 'User not found' });
    }
});

//get auch mit params :username
app.post('/users/:username', (req, res) => {
    let x = req.body;
    console.log(x);
    const username = req.params.username;
    const userIndex = users.findIndex(user => user.username === username && user.authToken !== null);

    const user = getUserByUsername(username);

    if (userIndex !== -1) {
        res.status(409).send({ massage: 'User already logged in' });
    } else if (user === undefined) {
        res.status(401).send({ massage: 'Invalid username or password' });
    } else if (!comparePassword(x.password, user.password)) {
        res.status(401).send({ massage: 'Invalid username or password11' });
    } else {
        const authToken = generateAuthToken();
        updateUserAuthToken(user.username, authToken);
        res.send({ success: 'Login successful', authToken: authToken });
    }
});

app.post('/users', (req, res) => {
    let x = req.body;
    console.log(x);

    if (isUsernameTaken(x.username)) {
        res.status(409).send({ massage: 'Username already taken' });
    } else {
        const authToken = generateAuthToken();
        console.log(authToken);
        createUser(x.username, x.password, authToken, 0);
        res.send({ success: 'User created successfully', authToken: authToken });
    }
})

app.get('/highscores/:authToken', (req, res) => {
    const authToken = req.params.authToken;
    const userIndex = users.findIndex(user => user.authToken === authToken);

    if (userIndex !== -1) {
        res.send({ success: 'Highscore retrieved successfully', highscore: users[userIndex].highscore });
    } else {
        res.status(400).send({ massage: 'User not found' });
    }
});

app.post('/highscores/:authToken', (req, res) => {
    const authToken = req.params.authToken;
    const x = req.body;
    const userIndex = users.findIndex(user => user.authToken === authToken);

    if (userIndex !== -1) {
        users[userIndex].highscore = x.highscore;
        res.send({ success: 'Highscore updated successfully' });
    } else {
        res.status(400).send({ massage: 'User not found' });
    }
});

app.listen(3000, () => { //start a server on port 3000
    console.log('Example app listening at http://localhost:3000');
});