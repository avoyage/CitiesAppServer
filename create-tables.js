'use strict';

const mysql = require('mysql');

const pool = mysql.createPool({
	connectionLimit: 100,
	host    : 'localhost',
 	user    : 'billie-joe',
	password: '%p4$$w0rd%*FUCK*Y0U*',
  database: 'tv_show'
});

pool.getConnection((err, connection) => {});

const queries = {
	createTableTV: ```CREATE TABLE `tv` (
  `tv_id` int(11) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `title_en` VARCHAR(30),
  `title_ru` VARCHAR(30),
  `year` VARCHAR(10),
  `runtime` tinyint UNSIGNED,
  `poster_en` text,
  `poster_ru` text,
  `imdb_id` VARCHAR(10),
  `imdb_rating` float DEFAULT NULL,
  `kinopoisk_id` VARCHAR(10),
  `kinopoisk_rating` float DEFAULT NULL,
  `total_seasons` tinyint UNSIGNED,
  `plot_en` text,
  `plot_ru` text,
  UNIQUE KEY `title_en` (`title_en`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;```,

  createTableGenre: `create table genres (
    genre_id INT(10) UNSIGNED, 
    genre VARCHAR(20));`,

  createTableTVGenreMapping: `create table tv_genre_mapping (
    tv_genre_id INT(10) UNSIGNED, 
    tv_id INT(10) UNSIGNED,
	  genre_id INT(10) UNSIGNED);`,

};

/*
select m.*, group_concat(g.genre)
from movies m inner join movie_genre mg
on m.movie_id=mg.movie_id
inner join genres g
on g.genre_id=mg.genre_id
group by m.movie_id;
*/


pool.on('connection', (connection) => {
	for (let query in queries) {
		if (queries.hasOwnProperty(query)) {
			connection.query(queries[query], (err, rows, fields) => {
				if (err) throw err;
			});
		}
	}

	connection.destroy();
});
