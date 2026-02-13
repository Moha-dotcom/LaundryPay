import pool from "../config/dbconnect.js";
import {type QueryResult} from 'pg'

import {Pool }  from "pg";
import UserModel from "../models/UserModel.ts";
import {createLogger, format, transports} from 'winston'
const { combine, timestamp, label, prettyPrint, } = format;
const logger = createLogger({
    format: combine(
        timestamp(),
        prettyPrint(),
    ),
    transports: [new transports.Console()]
})


export default class UserRepository {
    private readonly pool: Pool;

    constructor( pool : Pool ) {
        this.pool = pool;
    }

    getPool(){
        return this.pool;
    }
    async findUserByPhone(phoneNumber : string) : Promise<boolean>{
        try {
            const query = {
                text : 'SELECT id FROM users WHERE phoneNumber = $1',
                values : [phoneNumber]
              }
          const checkUser: QueryResult<{id : number}> = await this.pool.query(query);
            return checkUser.rows.length > 0;
           }catch(err){
               console.error(err);
               return false
           }
    }

    async saveUser(user : UserModel) : Promise<boolean>{
            try {
                const result : QueryResult<{id : number , full_name : string, phoneNumber : string}> = await this.pool.query(`INSERT INTO USERS (full_name, phoneNumber)
                VALUES ($1, $2) returning id, full_name, phoneNumber`, [user.full_name, user.phoneNumber]);
                if(result.rows.length > 0){
                    logger.info("User has been  saved successfully");
                    return true;
                }else{
                    logger.info("User already exists");
                    return false;
                }
            }catch(err){
                console.error("Error saving user:", err);
                throw err;
            }
    }

}

// We're using pool here because we jsut need one connection, and it will close or end Automatically.
// I won't hold a connection in place once it's done with it, it will release
const newUser = new UserModel('Mohamed  Abdullahi', '738834993')
export const userRepository = new UserRepository(pool);
console.log(await userRepository.findUserByPhone('738834993'));


