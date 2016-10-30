'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _userCreateInputsValidator = require('./user-create-inputs-validator');

var _userCreateInputsValidator2 = _interopRequireDefault(_userCreateInputsValidator);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

var pool = _mysql2.default.createPool(_config2.default);

pool.getConnection(function (err, connection) {
  app.post('/user/', function (req, res) {
    var username = req.body.username;
    var hash = req.body.hash;
    var firstName = req.body.firstName || '';
    var lastName = req.body.lastName || '';

    if (!_userCreateInputsValidator2.default.isInputsValid(username, hash, firstName, lastName)) {
      res.status(400).send(JSON.stringify('Bad Request'));
      return;
    }

    var query = 'INSERT INTO user (username, firstName, lastName, hash, registrationTimestamp) VALUES (\'' + username + '\', \'' + firstName + '\', \'' + lastName + '\', \'' + hash + '\', UTC_TIMESTAMP()+0) ON DUPLICATE KEY UPDATE username=\'' + username + '\'';

    connection.query(query, function (err, rows) {
      if (!err) {
        res.format({
          json: function json() {
            res.end(JSON.stringify(rows));
          }
        });
      }
    });
  });

  app.get('/user', function (req, res) {
    var username = req.param('username');
    var query = 'SELECT username FROM user WHERE username=\'' + username + '\'';
    connection.query(query, function (err, rows) {
      if (!err) {
        res.format({
          json: function json() {
            res.end(JSON.stringify({ isExist: !!rows[0] }));
          }
        });
      }
    });
  });

  app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var query = 'SELECT *, CONVERT(hash, CHAR(60)) as hash FROM user WHERE username=\'' + username + '\'';

    connection.query(query, function (err, rows) {
      if (!err && rows.length && _bcrypt2.default.compareSync(password, rows[0].hash)) {
        var _ret = function () {
          var user = rows[0];
          var result = {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            bio: user.bio,
            registrationTimestamp: user.registrationTimestamp
          };

          res.format({
            json: function json() {
              res.end(JSON.stringify(result));
            }
          });
          return {
            v: void 0
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
      res.status(401).send(JSON.stringify('Unauthorized'));
    });
  });
});

app.listen(process.env.PORT || 5000);