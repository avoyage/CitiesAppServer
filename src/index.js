'use strict';

import express from 'express';
import helmet from 'helmet';
import mysql from 'mysql';
import bcrypt from 'bcrypt';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import useragent from 'express-useragent';

import validator from './validator';
import config from './config';

const app = express();

app.use(helmet());
app.use(useragent.express());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    name: 'session',
    keys: ['key0123', 'key234'],
    secret: 'he11o,%w0r1d!',
    cookie: {
      secure: true,
      httpOnly: true,
    }
  })
);

const checkSession = (req, res, next) => {
  const userAgent = req.useragent;
  const session = req.session;
  if (userAgent.browser === 'AwesomeProject' && session && session.isLoggedIn) {
    return next();
  } else {
    res.sendStatus(401);
  }
};

const pool = mysql.createPool(config);

pool.getConnection((err, connection) => {
  app.post('/user/', (req, res) => {
    const username = req.body.username;
    const hash = req.body.hash;
    const firstName = req.body.firstName || '';
    const lastName = req.body.lastName || '';

    if (!validator.isCreateUserInputsValid(username, hash, firstName, lastName)) {
      res.sendStatus(400);
      return;
    }

    const query = `INSERT INTO user (username, firstName, lastName, hash, registrationTimestamp) VALUES ('${username}', '${firstName}', '${lastName}', '${hash}', UTC_TIMESTAMP()+0) ON DUPLICATE KEY UPDATE username='${username}'`;

    connection.query(query, (err, rows) => {
      if (!err) {
        res.format({
          json() {
            res.end(JSON.stringify(rows));
          }
        });
      }
    });
  });

  app.get('/user', (req, res) => {
    const username = req.param('username');
    const query = `SELECT username FROM user WHERE username='${username}'`;
    connection.query(query, (err, rows) => {
      if (!err) {
        res.format({
          json() {
            res.end(JSON.stringify({isExist: !!rows[0]}));
          }
        });
      }
    });
  });

  app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!validator.isLoginParamsValid(username, password)) {
      res.sendStatus(401);
    }

    const query = `SELECT hash, CONVERT(hash, CHAR(60)) as hash FROM user WHERE username='${username}'`;

    connection.query(query, (err, rows) => {
      if (!err && rows.length && bcrypt.compareSync(password, rows[0].hash)) {
        req.session.isLoggedIn = true;
        res.format({
          json() {
            res.sendStatus(200);
          }
        });
        return;
      }
      res.sendStatus(401);
    });
  });

  app.get('/feed', checkSession, (req, res) => {
    const feed = [{
      id: '1',
      text: 'Hello, City!',
      image: 'https://scontent-frt3-1.cdninstagram.com/t51.2885-15/e35/14736281_211360869294420_765623301136449536_n.jpg',
      author: {
        fullName: 'Pierre',
        username: 'pierre',
        image: 'https://scontent-frt3-1.xx.fbcdn.net/v/t1.0-1/p320x320/1913867_1133637809981762_4149238391283925419_n.jpg?oh=403dd0706a42d1895aad1bcc84e44cdd&oe=58963126'
      },
      created: Date.now()
    }];

    res.format({
      json() {
        res.end(JSON.stringify(feed));
      }
    });
  });

  app.post('/post', checkSession, (req, res) => {
    if (req.session && req.session.username && req.session.id) {
      return next();
    }
    res.sendStatus(200);
  });

  app.get('/logout', checkSession, (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  });
});

app.listen(process.env.PORT || 5000);
