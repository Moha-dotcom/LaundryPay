
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

CREATE TABLE machines (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,          -- e.g., "Washer #1" or location code
    location VARCHAR(100),               -- optional: laundromat branch / room
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

