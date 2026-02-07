
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

SET app.current_user_id = '3';
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


DROP POLICY IF EXISTS account_update ON accounts;
DROP POLICY IF EXISTS user_access ON accounts;

DROP policy user_access on accounts;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;






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


-- Working On Queries
SELECT * FROM ACCOUNTS;


-- Check if user has an account
SELECT u.id as user_id, A.id as account_id FROM USERS u
JOIN ACCOUNTS A on u.id = A.user_id
WHERE u.id = 2;

SELECT * FROm users;


SET app.current_user_id = '3';

DELETE FROM ACCOUNTS where user_id = 2;


SELECT * FROM DEPOSITS;
-- BEFORE WE COULD HAVE SEVERAL ACCOUNTS FOR ONE USERS
-- NOW WE IMPLEMENT UNIQUE USER ACCOUNT CONSTRAINT
ALTER TABLE accounts
    ADD CONSTRAINT unique_user_account UNIQUE (user_id);

SELECT * FROM ACCOUNTS;
INSERT INTO accounts(user_id, balance)
VALUES ( 3, 0 ) RETURNING id, balance;
GRANT INSERT ON ACCOUNTS TO laundryapp;

SET ROLE laundryapp;
SET ROLE postgres;

DROP policy account_insert on accounts;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY account_insert
    ON accounts
    FOR INSERT
    WITH CHECK (
    current_setting('app.current_user_id', true) IS NULL
        OR user_id = current_setting('app.current_user_id', true)::bigint
    );
-- SELECT
CREATE POLICY user_access
    ON accounts
    USING (
    user_id = NULLIF(current_setting('app.current_user_id', true), '')::bigint
    );

-- UPDATE
CREATE POLICY account_update
    ON accounts
    FOR UPDATE
    USING (
    user_id = NULLIF(current_setting('app.current_user_id', true), '')::bigint
    )
    WITH CHECK (
    user_id = NULLIF(current_setting('app.current_user_id', true), '')::bigint
    );

-- INSERT
CREATE POLICY account_insert
    ON accounts
    FOR INSERT
    WITH CHECK (
    user_id = NULLIF(current_setting('app.current_user_id', true), '')::bigint
    );

DROP POLICY account_insert on accounts;


INSERT INTO accounts(user_id, balance) VALUES (1, 1000);
INSERT INTO accounts(user_id, balance) VALUES (2, 45.33);

SELECT deposited_amount, createAt FROM deposits  ORder By id desc limit 3  ;

SELECT count(d.id) As NumberofDeposit FROM DEPOSITS d;



INSERT INTO DEPOSITS (deposited_amount, account_id) VALUES (100, 4)