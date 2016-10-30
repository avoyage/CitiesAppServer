'use strict';

var mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit: 100,
	host: 'localhost',
	user: 'billie-joe',
	password: '%p4$$w0rd%*FUCK*Y0U*',
	database: 'cities'
});

pool.getConnection(function (err, connection) {});

var queries = {
	UserTable: 'CREATE TABLE IF NOT EXISTS user (\n\t\tid INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,\n\t\tusername VARCHAR(15),\n\t\tfirstName VARCHAR(15),\n\t\tlastName VARCHAR(15),\n\t\tphone CHAR(15),\n\t\tbio VARCHAR(160),\n\t\tregistrationTimestamp TIMESTAMP,\n\t\thash BINARY(60)\n\t)'

};

pool.on('connection', function (connection) {
	for (var query in queries) {
		if (queries.hasOwnProperty(query)) {
			connection.query(queries[query], function (err, rows, fields) {
				if (err) throw err;
			});
		}
	}

	connection.destroy();
});