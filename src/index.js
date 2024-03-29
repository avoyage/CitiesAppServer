'use strict';

import express from 'express';
import helmet from 'helmet';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import useragent from 'express-useragent';
import rollbar from 'rollbar';

import config from './config';
import validator from './validator';
import fetchProfile from './fetchProfile';
import login from './login';
import feed from './feed';

const app = express();
app.use(helmet());
app.use(useragent.express());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Use the rollbar error handler to send exceptions to rollbar
app.use(rollbar.errorHandler('6a5259c4ada44e52b0732a9d9167a422'));
app.use(cookieSession({
        name: 'session',
        keys: ['key0123', 'key234'],
        secret: 'he11o,%w0r1d!',
        cookie: {
            secure: true,
            httpOnly: true,
        },
    })
);

const BROWSER_NAME = 'AwesomeProject';

const checkSession = (req, res, next) => {
    const userAgent = req.useragent;
    const session = req.session;

    if (userAgent.browser === BROWSER_NAME && session && session.username) {
        return next();
    } else {
        res.sendStatus(401);
    }
};

const checkBrowser = (req, res, next) => {
    if (req.useragent.browser === BROWSER_NAME) {
        return next();
    } else {
        res.sendStatus(401);
    }
};

const serverErrorHandler = (res, error) => {
    res.sendStatus(503);
    console.error(error);
};

const pool = mysql.createPool(config);

pool.getConnection((error, connection) => {
        if (error) console.error(error);

        app.get('/feed', checkSession, (req, res) => {
            feed(connection).then(
                result => {
                    res.format({
                        json() {
                            res.end(JSON.stringify(result));
                        }
                    });
                },
                error => serverErrorHandler(res, error)
            );
        });

        app.get('/ping', checkSession, (req, res) => {
            res.sendStatus(200);
            fetchProfile(connection, username).then(
                profile => {
                    res.format({
                        json() {
                            res.end(JSON.stringify(profile));
                        }
                    });
                },
                error => serverErrorHandler(res, error)
            );
        });

        app.get('/profile', checkSession, (req, res) => {
            const username = req.session.username;
            fetchProfile(connection, username).then(
                profile => {
                    res.format({
                        json() {
                            res.end(JSON.stringify(profile));
                        }
                    });
                },
                error => serverErrorHandler(res, error)
            );
        });

        app.post('/login', checkBrowser, (req, res) => {
            const username = req.body.username;
            const password = req.body.password;


            if (validator.isLoginParamsValid(username, password)) {
                console.log(connection, username, password,1);
                login(connection, username, password).then(
                    user => {
                        req.session.username = username;
                        res.format({
                            json() {
                                res.end(JSON.stringify(user));
                            }
                        })
                    },
                    error => {
                        serverErrorHandler(res, error)
                    }
                );
            } else {
                res.sendStatus(401);
            }
        });

        app.get('/logout', (req, res) => {
            req.session = null;
            res.sendStatus(200);
        });

        app.get('/checkUsername', checkBrowser, (req, res) => {
            const username = req.param('username');
            const query = `SELECT username FROM user WHERE username='${username}'`;
            connection.query(query, (error, rows) => {
                if (error) {
                    serverErrorHandler(res, error)
                } else {
                    res.format({
                        json() {
                            res.end(JSON.stringify({isExist: !!rows[0], username: username}));
                        }
                    });
                }
            });
        });
    }
);

app.listen(process.env.PORT || 5000);
console.log('START');
