import pool from '../config/dbconnect.js'
const log = console.log
class Deposit {
    constructor( deposit_amount, account_id) {
        this._deposit_amount = deposit_amount;
        this._account_id = account_id;
    }
    get deposit_amount() { return this._deposit_amount; }
    get account_id() { return this._account_id; }
    // async set deposit( amount ) {
    //     // connect to the Database
    //     const client = await pool.connect();
    //     // Deposit Process
    //     // Get the Balance on the account of the user
    //     // then Update the balance
    //     // then record that balance on the deposit table
    //
    //
    //
    // }

    static async setDeposit(deposit) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            // 1️⃣ Normalize & validate inputs
            const accountId = Number(deposit._account_id);
            const depositAmount = Number(deposit._deposit_amount);

            if (!Number.isInteger(accountId)) {
                throw new Error('Invalid account_id');
            }

            if (!Number.isFinite(depositAmount) || depositAmount <= 0) {
                throw new Error('Invalid deposit amount');
            }
            // 2️⃣ Get the account owner (NO RLS YET)
            const accountResult = await client.query(
                `SELECT user_id FROM accounts WHERE id = $1`,
                [accountId]
            );
            if (accountResult.rows.length === 0) {
                throw new Error('Account not found');
            }

            const userId = accountResult.rows[0].user_id;
            log(userId);

            // 3️⃣ Set RLS context (must be user_id, NOT account_id)
            await client.query(
                `SELECT set_config('app.current_user_id', $1, true)`,
                [String(userId)]
            );

            // 4️⃣ Apply deposit (RLS enforced here)
            const updateResult = await client.query(
                `UPDATE accounts
             SET balance = balance + $1,
                 updateAt = now()
             WHERE id = $2
             RETURNING balance, updateAt`,
                [depositAmount, accountId]
            );

            if (updateResult.rows.length === 0) {
                throw new Error('Deposit blocked by RLS');
            }

            await client.query('COMMIT');
            return updateResult.rows[0];

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }




    }

    getAllDeposits() {

    }
}

const deposits = new Deposit(90, 1)
Deposit.setDeposit(deposits).then(r => log(r)).catch(err => log(err.message));


