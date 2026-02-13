import UserRepository from '../domain/UserRepository.ts'
import User from "../domain/User";
import type {QueryResult} from "pg";
import {query} from "winston";
import * as console from "node:console";
import {pool} from "../../config/dbconnect.js";
import {Pool }  from "pg";

import {createLogger, format, transports} from 'winston'
const { combine, timestamp, label, prettyPrint, } = format;
const logger = createLogger({
    format: combine(
        timestamp(),
        prettyPrint(),
    ),
    transports: [new transports.Console()]
})


class PostgresUserRepository implements UserRepository {
    private readonly pool: Pool;

    constructor( pool : Pool ) {
        this.pool = pool;
    }


   async findUserByPhoneNumber(phoneNumber: string): Promise<boolean> {
        try {
            const query = {
                text : 'SELECT id, full_name, phonenumber FROM users WHERE phoneNumber = $1',
                values : [phoneNumber]
            }

            const checkUser: QueryResult = await this.pool.query(query);
            logger.info( checkUser.rows[0]);
            return checkUser.rows.length > 0;
        }catch(err){
            console.error(err);
            return false
        }
    }

    async saveUser (user: User): Promise<boolean> {
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

// const client = await pool.connect()
// const newUserPosregs = new PostgresUserRepository(pool)
// logger.info(await newUserPosregs.findUserByPhoneNumber('764-829-6182'));