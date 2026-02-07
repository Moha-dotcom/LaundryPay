import pool from '../config/dbconnect.js'
import {createLogger, format, transports} from 'winston'
const { combine, timestamp, label, prettyPrint, } = format;
const logger = createLogger({
    format: combine(
        timestamp(),
        prettyPrint(),
    ),
    transports: [new transports.Console()]
})

const log = console.log
class Deposit {
    constructor(user_id,  deposit_amount, account_id) {
        this._user_id = user_id;
        this._deposit_amount = deposit_amount;
        this._account_id = account_id;
    }
    getDeposit_amount() { return this._deposit_amount; }
    getAccount_id() { return this._account_id; }
    getUserID(){return this._user_id}


    // logic would be :
    // Get the userId
    // Join  User & Account Table Get the Account Id
    // If It doesn't return anything Then Create A New account For the
    // User with Starting Balance 0

    // Later we will work on register User Once we register user we will
    // Automatically assign an Account ID
    // That How the deposit should have worked

    async depositIntoAccount(){
        let client;
        try {
            client = await pool.connect();
            await client.query('BEGIN');
            // We have to check if the user has an Account

            await this.setCurrentUser(client, this.getUserID());
            const result = await client.query(`SELECT u.id   AS user_id,  a.id   AS account_id,  a.balance
            FROM users u
            JOIN accounts a ON u.id = a.user_id
            WHERE u.id = $1
            `,
                [this.getUserID()]
            );
            // If no account, create one
            if (result.rows.length === 0) {
                throw new Error('User does not have an account');
            }


            console.log(`Balance: ${balance}`);

            await client.query('COMMIT')
            // console.log(result.rows);
        }catch (err){
            logger.error(err.message);
        }

    }



    async setDeposit() {
        let client;
        try {
            client  = await pool.connect();
            await client.query('BEGIN');
            await this.setCurrentUser(client, this.getUserID());
            // If the account id is not available for this userId
             // check if the account Id is available if it's Not
             const accountId = await client.query(
                 `SELECT * FROM accounts WHERE id = $1`,
                 [this.getAccount_id()]
             );

            let startingBalance = 0;
            if (accountId.rows.length === 0) {
                await client.query(
                    `INSERT INTO accounts (user_id, balance)  VALUES ($1, $2)`,
                    [this._user_id, startingBalance]
                );
            }
             // log(`Account ID: ${accountId.rows[0].id}`);
            // Generate an account ID
            if(this.getDeposit_amount() <= 5){
                 logger.error('Deposit Amount Has to be More than or Equal to $5')
            }
            // 4️⃣ Apply deposit (RLS enforced here)
            const updateResult = await this.updateUserAccountWithNewDepositAmount(client, this.getDeposit_amount(), this.getAccount_id());
            let res = await this.storeDepositLogs(client, this.getDeposit_amount(), this.getAccount_id());// If deposit is Less than 0 Don't store
            await client.query('COMMIT');
            logger.info(`Your current Balance is : ${updateResult.rows[0].balance}` )
            return res.rows[0]

        }catch (error) {
            logger.error(error.message);
        }finally {
            await client.release();
        }
    }

    async recentDeposit(){
        const client = await pool.connect();
        try {
           const ListOfDeposit =  await client.query('SELECT deposited_amount, createAt FROM deposits  ORder By id desc limit 3   ');
            return ListOfDeposit.rows;
        }catch (error) {
            logger.error(error);
        }finally {
            await client.release();
        }
    }


     async storeDepositLogs(client, deposit_amount, account_id) {
        if(deposit_amount < 1)  throw new Error ('Deposit amount should be greater than 0');
        return await client.query(`INSERT INTO DEPOSITS (deposited_amount, account_id) VALUES ($1, $2)  RETURNING deposited_amount `, [Number(deposit_amount), Number(account_id)])
    }


     async setCurrentUser(client, user_id) {
        await client.query(
            `SELECT set_config('app.current_user_id', $1, true)`,
            [String(user_id)],
        );
    }

     async updateUserAccountWithNewDepositAmount(client, deposit_amount, account_id) {
        return await client.query(
            `UPDATE accounts
             SET balance = balance + $1,
                 updateAt = now()
             WHERE id = $2
             RETURNING balance, updateAt`,
            [Number(deposit_amount), Number(account_id)]
        );
    }

}

/// Here We are supposed to use account_id we have to automatically
// Join The User and Account Table to get the Account ID of the user
// We will Change that Later
// SELECT u.id, A.id FROM USERS u
// JOIN ACCOUNTS A on u.id = A.user_id;

const deposits = new Deposit(2, 6, 4)
// const executeDeposit = deposits.setDeposit(deposits);
// logger.info(await  executeDeposit);
// logger.info(await deposits.recentDeposit());


const result = await deposits.depositIntoAccount();
logger.info( result);