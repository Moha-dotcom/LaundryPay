import pool from "../config/dbconnect.js";
import {type QueryResult} from 'pg'
import pg from "pg";
type PoolClient = ReturnType<pg.Pool["connect"]>;
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
    private client: PoolClient;

    constructor( client : PoolClient ) {
        this.client = client;
    }

    getClient(){
        return this.client;
    }
    async findUserByPhone(phoneNumber : string) : Promise<boolean>{
        // We work on check if the User phoneNumber is Valid
        try {
          const checkUser: QueryResult= await this.client.query(`SELECT id FROM users WHERE phoneNumber = $1`,
              [phoneNumber]);
               return checkUser.rows.length > 0;
           }catch(err){
               console.error(err);
               return false
           }
    }

    async saveUser(user : UserModel) : Promise<boolean>{
            try {
                const result : QueryResult = await this.client.query(`INSERT INTO USERS (full_name, phoneNumber)
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


const client = await pool.connect();
export const userRepository = new UserRepository(client);
// // const exists =   userRepository.findUserByPhone('6125550101');
// const savedUser = await userRepository.saveUser(user1);
// // console.log(await savedUser)
// // console.log("User exists:", await exists);
// // client.release();