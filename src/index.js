'use strict';

import mysql from 'mysql';
import bcrypt from 'bcrypt';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userCreateInputsValidator from './user-create-inputs-validator';
import config from './config';
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = mysql.createPool(config);

pool.getConnection((err, connection) => {
  app.post('/user/', (req, res) => {
    const username = req.body.username;
    const hash = req.body.hash;
    const firstName = req.body.firstName || '';
    const lastName = req.body.lastName || '';

    if (!userCreateInputsValidator.isInputsValid(username, hash, firstName, lastName)) {
      res.status(400).send(JSON.stringify('Bad Request'));
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

    const query = `SELECT *, CONVERT(hash, CHAR(60)) as hash FROM user WHERE username='${username}'`;

    connection.query(query, (err, rows) => {
      if (!err && rows.length && bcrypt.compareSync(password, rows[0].hash)) {
        const user = rows[0];
        const result = {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          bio: user.bio,
          registrationTimestamp: user.registrationTimestamp
        };

        res.format({
          json() {
            res.end(JSON.stringify(result));
          }
        });
        return;
      }
      res.status(401).send(JSON.stringify('Unauthorized'));
    });
  });
});

app.listen(process.env.PORT || 5000);
