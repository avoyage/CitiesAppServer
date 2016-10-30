'use strict';

const mysql = require('mysql');

const pool = mysql.createPool({
	connectionLimit: 100,
	host    : 'localhost',
 	user    : 'billie-joe',
	password: '%p4$$w0rd%*FUCK*Y0U*',
  database: 'cities'
});

pool.getConnection((err, connection) => {});

const queries = {
	UserTable: `CREATE TABLE IF NOT EXISTS user (
		id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
		username VARCHAR(15),
		firstName VARCHAR(15),
		lastName VARCHAR(15),
		phone CHAR(15),
		bio VARCHAR(160),
		registrationTimestamp TIMESTAMP,
		hash BINARY(60)
	)`,

	// FollowTable: `CREATE TABLE IF NOT EXISTS Follow (
	// 	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	// 	userId INT UNSIGNED,
	// 	followerId INT UNSIGNED
	// )`,
  //
	// LikeTable: `CREATE TABLE IF NOT EXISTS Follow (
	// 	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	// 	userId INT UNSIGNED,
	// 	messageId INT UNSIGNED
	// )`,
  //
	// ImageTable: `CREATE TABLE IF NOT EXISTS Image (
	// 	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	// 	type VARCHAR(25),
	// 	name VARCHAR(25),
	// 	data LONGBLOB,
	// 	size VARCHAR(25)
	// )`,
  //
	// MessageTable: `CREATE TABLE IF NOT EXISTS Post (
	// 	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	// 	text VARCHAR(300),
	// 	image MEDIUMINT UNSIGNED,
	// 	author INT UNSIGNED,
	// 	created DATE
	// )`
};


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
