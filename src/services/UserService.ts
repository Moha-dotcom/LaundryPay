import pool from '../config/dbconnect.js'
import {userRepository} from '../Repository/UserRepository.ts';
import UserRepository from '../Repository/UserRepository.ts';
import UserModel from "../models/UserModel.ts";
import {type QueryResult} from 'pg'

import {PoolClient }  from "pg";
import {createLogger, format, transports} from 'winston'
const { combine, timestamp, label, prettyPrint, } = format;
const logger = createLogger({
    format: combine(
        timestamp(),
        prettyPrint(),
    ),
    transports: [new transports.Console()]
})


 class UserService {
     public userRepository: UserRepository;
    constructor(  userRepository :UserRepository) {
        this.userRepository = userRepository;
    }
    async registerUser(userModel : UserModel) : Promise<boolean> {
        let client : PoolClient;
        try {
             client = await pool.connect()
            return await this.verifyUser(client, userModel);
        }catch(err){
           if(client ) await client.query('ROLLBACK'); // ensure rollback on any error
            logger.error("Error in registerUser:", err instanceof Error ? err.message : err);
            return false;
        }finally {
            if(client) client.release()
        }
    }

     private async verifyUser(client: PoolClient, userModel: UserModel) {
         await client.query('BEGIN')
         const verifyPhoneNumber = await this.userRepository.findUserByPhone(userModel.phoneNumber);
         if (verifyPhoneNumber) {
             await client.query('ROLLBACK')
             logger.error("User already exists Please Login");
             return false;
         }
         const result = await this.userRepository.saveUser(userModel);
         await client.query('COMMIT')
         return result;
     }


     async showBalance(userModel : UserModel) : Promise<boolean> {


     }
 }

const user1 = new UserModel( "Mustafa ppp",  "764-829-6182")

const userServ = new UserService(userRepository);
const result = await userServ.registerUser(user1)
console.log( result);

























// async function checkUserAvailability(client ,phoneNumber) {
//     const checkUser = await client.query(
//         `SELECT id FROM users WHERE phoneNumber = $1`,
//         [phoneNumber]
//     );
//     if (checkUser.rows.length > 0) throw new Error('UserModel with this phone number already exists');
//     return true;
// }
//
// async function insertUserIntoDatabase(client, full_name, phoneNumber) {
//     return await client.query(`INSERT INTO USERS (full_name, phoneNumber)
//         VALUES ($1, $2) returning id, full_name, phoneNumber`, [full_name, phoneNumber]);
// }
//
// async  function registerUser (full_name, phoneNumber) {
//     const client = await pool.connect(); // using .connect for transaction queries
//     try {
//         await client.query(`BEGIN`)
//         await checkUserAvailability(client, phoneNumber);
//         const result = await insertUserIntoDatabase(client, full_name, phoneNumber);
//         await client.query(`COMMIT`)
//         return result.rows[0];
//
//     }catch (error) {
//         await client.query('ROLLBACK');
//         throw error;
//     } finally {
//     client.release();
// }
// }
//
//


// registerUser('Mike Tyson', '7360788283')
//     .then(user => console.log('UserModel created:', user))
//     .catch(err => console.error('Error:', err.message));


// async function setCurrentUserid(client, id) {
//     if(!id) throw new Error('UserModel ID is required');
//     await client.query(
//         `SELECT set_config('app.current_user_id', $1, true)`,
//         [String(id)]
//     );
// }
//
// async  function getUserBalance(client){
//
//    // This doesn't return all the accounts it just returns the current user  balance
//     // And also I have revoked the balance to be updated or Inserted in
//     const result = await client.query(
//         `SELECT balance FROM accounts`
//     );
//     return result.rows;
// }
//
// const log = console.log
//
// async function checkBalance(id) {
//     const client = await pool.connect();
//    try {
//
//        // We implemented RLS in the database and Also Applied Policies on table Account
//        // Now we can access every account Based on userId
//
//        await client.query(`BEGIN`)
//        await setCurrentUserid(client, id)
//        const userAccountBalance = await getUserBalance(client)
//        await client.query(`COMMIT`)
//        return userAccountBalance
//    }catch (error) {
//        await client.query('ROLLBACK');
//
//
//    }finally {
//        client.release();
//    }
//
// }
//
// export default {checkBalance, }
//
// checkBalance(2).then(result => {
//     log('user account info:', result);
// }).catch(err => log('user account info:', err));
