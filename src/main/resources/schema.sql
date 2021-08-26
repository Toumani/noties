CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS users_roles (
    username VARCHAR(255) NOT NULL,
    role VARCHAR (255) NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username)
);