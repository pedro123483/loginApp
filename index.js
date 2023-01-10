import express, { response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import dbConnect from './db/dbConnect.js';
import User from './db/userModel.js';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import auth from './auth.js';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();
dbConnect();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    next();
});

app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
        const user = new User({
            email: req.body.email,
            password: hashedPassword
        });

        user.save().then((result) => {
            res.status(201).send({
                message: 'User created successfully',
                result
            });
        }).catch((error) => {
            res.status(500).send({
                message: 'Error creating user',
                error
            });
        });
    }).catch((error) => {
        res.status(500).send({
            message: 'Password was not hashed successfully',
            error
        });
    });
});

app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }).then((user) => {
        bcrypt.compare(req.body.password, user.password).then((passwordCheck) => {
            if(!passwordCheck) {
                return res.status(400).send({
                    message: 'Password does not match',
                    error,
                });
            }

            const token = JWT.sign({
                userId: user._id,
                userEmail: user.email
            }, "RANDOM-TOKEN", { expiresIn: "24h" });

            res.status(200).send({
                message: 'Login successfull',
                email: user.email,
                token
            });

        }).catch((error) => {
            res.status(400).send({
                message: "Passwords does not match",
                error
            });
        });
    }).catch((error) => {
        res.status(404).send({
            message: 'Email not found',
            error
        });
    });
});

app.get('/auth-endpoint', auth, (req, res) => {
    res.json({ message: 'you are authorized to access me' });
});

app.get('/free-endpoint', (req, res) => {
    res.json({ message: 'you are free to access me' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
