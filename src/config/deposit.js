import pool from '../config/dbconnect.js'
import user from "../data/user.js";
const log = console.log
class Deposit {
    constructor(user_id,  deposit_amount, account_id) {
        this.user_id = user_id;
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

    static async setDeposit({user_id, account_id, deposit_amount}) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            await client.query(
                `SELECT set_config('app.current_user_id', $1, true)`,
                [String(user_id)],
            );
            // 4️⃣ Apply deposit (RLS enforced here)
            const updateResult = await client.query(
                `UPDATE accounts
             SET balance = balance + $1,
                 updateAt = now()
             WHERE id = $2
             RETURNING balance, updateAt`,
                [Number(deposit_amount), Number(account_id)]
            );
            await client.query('COMMIT');
            return updateResult.rows[0];

        }catch (error) {
            console.log(error);
        }finally {
            await client.release();
        }
    }

    storeDepositLogs(deposit_amount, account_id) {

    }
}

//

const deposits = new Deposit(2, 12, 4)
Deposit.setDeposit(deposits).then(r => log(r)).catch(err => log(err.message));


