CREATE TABLE USER
(
    user_id              VARCHAR(255)   PRIMARY KEY,
    pin                  VARCHAR(255)   NOT NULL,
    name                 VARCHAR(255)   NOT NULL,
    account_number       VARCHAR(255)   NOT NULL,
    account_balance      DOUBLE(10, 2)  NOT NULL,
    created_at           TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login           TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);