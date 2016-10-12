'use strict';

const mysql = require('mysql');
const bcrypt = require('bcrypt');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const useragent = require('express-useragent');

const app = express();
app.use(cors());
// app.use(useragent.express());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = mysql.createPool({
  host    : 'localhost',
  user    : 'billie-joe',
  password: '%p4$$w0rd%*FUCK*Y0U*',
  database: 'cities'
});

/**
 * @param {string} username
 * @returns {boolean}
 */
const isUsernameValid = (username) => {
  const re = new RegExp(/[A-Za-z0-9_]+/);
  return re.test(username);
};

/**
 * @param {string} username
 * @param {string} hash
 * @param {string} firstName
 * @param {string} lastName
 * @returns {boolean}
 */
const isCreateUserInputsValid = (username, hash, firstName, lastName) => {
  return username && username.length <= 15 && isUsernameValid(username) &&
    hash && hash.length === 60 &&
    firstName.length <= 15 &&
    lastName.length <= 15;
};

pool.getConnection((err, connection) => {
  app.post('/user/', (req, res) => {
    const username = req.body.username;
    const hash = req.body.hash;
    const firstName = req.body.firstName || '';
    const lastName = req.body.lastName || '';

    if (!isCreateUserInputsValid(username, hash, firstName, lastName)) {
      res.status(400).send(JSON.stringify('Bad Request'));
      return false;
    }

    const query = `INSERT INTO user (username, firstName, lastName, hash, registrationTimestamp) VALUES ('${username}', '${firstName}', '${lastName}', '${hash}', UTC_TIMESTAMP()+0) ON DUPLICATE KEY UPDATE username='${username}'`;

    connection.query(query, (err, rows) => {
      if (!err) {
        res.end(JSON.stringify(rows));
      }
    });
  });

  app.get('/user', (req, res) => {
    const username = req.param('username');
    const query = `SELECT username FROM user WHERE username='${username}'`;
    connection.query(query, (err, rows) => {
      if (!err) {
        res.end(JSON.stringify({isExist: !!rows[0]}));
      }
    });
  });

  app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const query = `SELECT *, CONVERT(hash, CHAR(60)) FROM user WHERE username='${username}'`;

    connection.query(query, (err, rows) => {
      if (!err && rows.length && bcrypt.compareSync(password, rows[0]['CONVERT(hash, CHAR(60))'])) {
        const {username, firstName, lastName, phone, bio, registrationTimestamp} = rows[0];
        const result = {username, firstName, lastName, phone, bio, registrationTimestamp};
        res.end(JSON.stringify(result));
        return;
      }
      res.status(401).send(JSON.stringify('Unauthorized'));
    });
  });
});

app.listen(5000);
