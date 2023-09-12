const router = require('express').Router();
const User = require('../server/models/users');
const Highscore = require('../server/models/highscore');
const mongoose = require('mongoose');
import { generateAuthToken, comparePassword } from '../server/index';

router.post('/users/:username', (req, res) => {
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

router.get('/users', (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.status(500).send({ massage: 'Error finding users' });
        } else {
            res.send(users);
        }
    });
});