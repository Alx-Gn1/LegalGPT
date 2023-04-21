DROP DATABASE gpt_lawyer;
DROP USER 'legalgpt'@'localhost';

CREATE DATABASE gpt_lawyer;
USE gpt_lawyer;

CREATE TABLE user (
id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(100) NOT NULL UNIQUE,
passwordHash TEXT NOT NULL,
profilePicture VARCHAR(100) NOT NULL,
currentJob VARCHAR(64),
contractType VARCHAR(32),
fullOrPartTime VARCHAR(32)
);

-- You need to set a password here and then set the same password as `MYSQL_PASSWORD` env variable
CREATE USER 'legalgpt'@'localhost' IDENTIFIED BY "PASSWORD";
GRANT SELECT, INSERT, UPDATE, DELETE ON gpt_lawyer.* TO "legalgpt"@"localhost";