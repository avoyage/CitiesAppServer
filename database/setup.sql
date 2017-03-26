CREATE TABLE IF NOT EXISTS user (
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(15),
	firstName VARCHAR(15),
	lastName VARCHAR(15),
	registrationTimestamp TIMESTAMP,
	hash BINARY(60)
);

INSERT INTO user (username, hash) VALUES ('@','$2a$10$Nk0ye.kE0EYM.eNzukVZz.Z7MBDHrEtzMgrr9H0IEjOgvN9j9CTay');
