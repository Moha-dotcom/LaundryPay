
CREATE TABLE users (
    id BIGINT generated always as IDENTITY PRIMARY KEY ,
    full_name VARCHAR(250) NOT NULL ,
    phoneNumber VARCHAR(200) NOT NULL  UNIQUE ,
    createAt timestamptz default now(),
    updateAt timestamptz default now(),
    deleteAt timestamptz default NULL

);


CREATE TABLE ACCOUNTS (
   id BIGINT generated always as IDENTITY PRIMARY KEY  ,
   user_id BIGINT references users(id) NOT NULL ,
   balance NUMERIC NOT NULL constraint balance_below_zero  CHECK ( balance >=  0 ),
  createAt timestamptz default now(),
   updateAt timestamptz default now()
);


CREATE TABLE DEPOSITS (
    id BIGINT generated always as IDENTITY  PRIMARY KEY ,
    deposited_amount Numeric NOT NULL check ( deposited_amount >= 5 ), --- Amount has to be greater than one wash,
    account_id BIGINT references accounts(id) NOT NULL ,
    createAt timestamptz default now(),
     updateAt timestamptz default now()
);
CREATE TABLE USAGE (
 id BIGINT generated always as IDENTITY PRIMARY KEY  ,
 account_id BIGINT references ACCOUNTS(id),
 machine_id BIGINT NOT NULL REFERENCES machines(id),
 usage_amount NUMERIC NOT NULL check ( usage_amount > 0 ),
 createAt timestamptz default now()

);

--
-- Tracking which machine is used most
-- Determining busy vs slow machines
-- Performing maintenance based on usage
CREATE TABLE machines (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,          -- e.g., "Washer #1" or location code
    location VARCHAR(100),               -- optional: laundromat branch / room
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);


CREATE ROLE laundryapp LOGIN PASSWORD 'laundrypassword';
--Just for test --  We will work on Limiting what the user has access to later
GRANT ALL ON users TO laundryapp;

SET ROLE laundryapp;


BEGIN;
SELECT id, users.full_name, users.phoneNumber FROM users
    WHERE phoneNumber = '7361788283';

INSERT INTO USERS (full_name, phoneNumber)
VALUES ('AHEMD SAHAL','7361788283' );

COMMIT ;



ALTER TABLE ACCOUNTS ENABLE ROW LEVEL SECURITY
SET app.current_user_id = '2';
CREATE POLICY account_owner_access
    ON accounts
    FOR SELECT
    USING (
    user_id = current_setting('app.current_user_id', true)::BIGINT
    );


--- Explicitly BLOCKING user updates

CREATE POLICY account_update
    ON accounts
    FOR UPDATE
    USING (false);


DROP POLICY IF EXISTS account_owner_access ON accounts;
CREATE POLICY user_access ON accounts
    USING (
    user_id = current_setting('app.current_user_id', true)::bigint
    );
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
SET ROLE laundryapp;
SET ROLE postgres;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY account_update
    ON accounts
    FOR UPDATE
    USING (
    user_id = current_setting('app.current_user_id')::bigint
    )
    WITH CHECK (
    user_id = current_setting('app.current_user_id')::bigint
    );


SET app.current_user_id = '2'
UPDATE accounts
SET balance = balance + 10,
    updateAt = now()
where id = 4
RETURNING balance, updateAt;

SELECT ;

SELECT * FROM accounts;
DROP POLICY account_update ON accounts;
SELECT * FROM accounts;
DROP POLICY IF EXISTS account_update ON accounts;
DROP POLICY IF EXISTS user_access ON accounts;

DROP policy account_owner_access ON accounts;

DROP policy account_update On ACCOUNTS;



SET ROLE laundryapp;
SET ROLE postgres;

SELECT * FROM users;
SELECT * from accounts;

GRANT UPDATE ON accounts TO laundryapp;

SET ROLE users;

UPDATE ACCOUNTS set balance = balance +  2,  updateAt = now()
                WHERE id = 2 RETURNING balance, updateAt;





-- OK here i did mistake of Assign accounts table to users ROLE instead of postgres
-- then Grant access to laundryapp
ALTER table ACCOUNTS OWNER TO postgres ;

-- Now we assign table accounts to ROLE postgres
-- We will GRANT Some Access to Laundry-app Role
GRANT SELECT ON ACCOUNTS TO laundryapp;
REVOKE SELECT ON ACCOUNTS from laundryapp;

SELECT * FROM ACCOUNTS;



INSERT INTO accounts(user_id, balance) VALUES (1, 1000);
INSERT INTO accounts(user_id, balance) VALUES (2, 45.33);

SELECT * FROM DEPOSITS;

SELECT count(d.id) As NumberofDeposit FROM DEPOSITS d;



INSERT INTO DEPOSITS (deposited_amount, account_id) VALUES (100, 4)