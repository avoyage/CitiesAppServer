'use strict';

import express from 'express';
import helmet from 'helmet';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import useragent from 'express-useragent';

import config from './config';
import validator from './validator';
import fetchProfile from './fetchProfile';
import updateProfile from './updateProfile';
import createPlace from './createPlace';
import login from './login';
import feed from './feed';

const app = express();
app.use(helmet());
app.use(useragent.express());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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

const checkSession = (req, res, next) => {
  const userAgent = req.useragent;
  const session = req.session;

  if (userAgent.browser === 'MyApp' && session && session.username) {
    return next();
  } else {
    res.sendStatus(401);
  }
};

const pool = mysql.createPool(config);

pool.getConnection((err, connection) => {
  app.get('/feed', checkSession, (req, res) => {
    feed(connection).then(
      result => {
        res.format({
          json() {
            res.end(JSON.stringify(result));
          }
        });
      },
      error => console.error('Get feed failed: ' + error)
    );
  });

  app.get('/ping', checkSession, (req, res) => {
    res.sendStatus(200);
  });

  app.get('/profile', checkSession, (req, res) => {
    const username = req.session.username;
    fetchProfile(connection, username).then(profile => {
      res.format({
        json() {
          res.end(JSON.stringify(profile));
        }
      });
    });
  });

  app.post('/profile', checkSession, (req, res) => {
    const username = req.session.username;
    updateProfile(connection, username, req.body).then(profile => {
      res.format({
        json() {
          res.end(JSON.stringify(profile));
        }
      });
    });
  });

  app.post('/login', (req, res) => {
    if (!req.useragent.browser === 'MyApp') {
      return;
    }

    const username = req.body.username;
    const password = req.body.password;

    if (validator.isLoginParamsValid(username, password)) {
      login(connection, username, password).then(
        user => {
          req.session.username = username;
          res.format({
            json() {
              res.end(JSON.stringify(user));
            }
          })
        },
        error => console.error('Login failed: ' + error)
      );
    } else {
      res.sendStatus(401);
    }
  });

  app.get('/logout', checkSession, (req, res) => {
    req.session = null;
    res.sendStatus(200);
  });

  app.post('/place', (req, res) => {
    const placeId = req.body.placeId;
    const mainText = req.body.mainText;
    const secondaryText = req.body.secondaryText;
    createPlace(connection, placeId, mainText, secondaryText).then(() => res.sendStatus(200));
  });
});

app.listen(process.env.PORT || 5000);
