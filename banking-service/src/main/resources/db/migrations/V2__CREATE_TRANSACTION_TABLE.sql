CREATE TABLE TRANSACTION (
    transaction_id      VARCHAR(255)    PRIMARY KEY,
    from_account        VARCHAR(255)    NOT NULL,
    to_account          VARCHAR(255)    NOT NULL,
    amount              DOUBLE(10, 2)   NOT NULL,
    date_time           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
)