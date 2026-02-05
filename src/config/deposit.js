import pool from '../config/dbconnect.js'

const log = console.log
class Deposit {
    constructor(user_id,  deposit_amount, account_id) {
        this.user_id = user_id;
        this._deposit_amount = deposit_amount;
        this._account_id = account_id;
    }
    get deposit_amount() { return this._deposit_amount; }
    get account_id() { return this._account_id; }

    async setDeposit({user_id, account_id, deposit_amount}) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await this.setCurrentUser(client, user_id);
            // 4️⃣ Apply deposit (RLS enforced here)
            const updateResult = await this.updateUserAccountWithNewDepositAmount(client, deposit_amount, account_id);
            let res = await this.storeDepositLogs(client, deposit_amount, account_id);// If deposit is Less than 0 Don't store
            await client.query('COMMIT');
            log(updateResult.rows[0])
            return res.rows[0]

        }catch (error) {
            console.log(error);
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

const deposits = new Deposit(2, 192, 4)
deposits.setDeposit(deposits).then(r => log(r)).catch(err => log(err.message));


