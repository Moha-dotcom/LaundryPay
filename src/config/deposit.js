import pool from '../config/dbconnect.js'
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
}


