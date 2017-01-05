'use strict';

const express = require('express');
const helmet = require('helmet');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(helmet());
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

const WebSocketServer = require('uws').Server;
const wss = new WebSocketServer({ port: 3000 });

function onMessage(message) {
  console.log('received: ' + message);
}

wss.on('connection', (ws) => {
  ws.on('tv', onMessage);
  console.log(ws,1)
  ws.send('something');
});

const pool = mysql.createPool({
  "host"    : "localhost",
  "user"    : "root",
  "password": "4444",
  "database": "tv"
});

pool.getConnection((err, connection) => {
  // app.get('/tvs', (req, res) => {
  //   const query = `SELECT title_en, title_ru, start_year, end_year, runtime, poster_en, total_seasons, substring_index(group_concat(a.name_ru separator ','), ',', 4) as actors
  //     FROM tv t
  //     INNER JOIN tv_actor_mapping ta ON t.tv_id = ta.tv_id
  //     INNER JOIN actor a ON a.actor_id = ta.actor_id
  //     GROUP BY t.tv_id
  //     ORDER BY t.kinopoisk_rating DESC;`;
  //   connection.query(query, (error, rows) => {
  //     if (error) {
  //       res.sendStatus(503);
  //     } else {
  //       res.format({
  //         json() {
  //           res.end(JSON.stringify(rows));
  //         }
  //       });
  //     }
  //   });
  // });

  app.get('/tv', (req, res) => {
    const tv_id = req.param('tv_id');
    const season = req.param('season') || 1;
    const query = `select json_object(
               'total_seasons', t.total_seasons,
               'episodes', (select CAST(CONCAT('[', GROUP_CONCAT(json_object(
                'episode', episode,
                'name', e.name
      )),
                        ']') as JSON) FROM episode e
      WHERE e.tv_id=${tv_id} and e.season=${season})
    ) as data
     from tv_prod t WHERE tv_id=${tv_id};`;
    connection.query(query, (error, rows) => {
      if (error) {
        res.sendStatus(503);
      } else {
        res.format({
          json() {
            res.end(rows[0].data);
          }
        });
      }
    });
  });

});

app.listen(process.env.PORT || 5000);

// select json_object(
//   'total_seasons', t.total_seasons,
//   'episodes', (select CAST(CONCAT('[', GROUP_CONCAT(json_object(
//     'episode', episode,
//     'name', e.name,
//     'player', p.name,
//     'url', concat(p.hostname, '/', f.name)
//     )),
//     ']') as JSON) FROM episode_player_mapping ep
// INNER JOIN episode e ON e.episode_id = ep.episode_id
// INNER JOIN player p ON p.player_id = ep.player_id
// INNER JOIN file f ON f.file_id = ep.file_id
// WHERE e.tv_id=${tv_id} and e.season=${season})
// ) as data
// from tv_prod t WHERE tv_id=${tv_id};