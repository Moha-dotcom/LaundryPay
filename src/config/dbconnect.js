import pkg from 'pg'
const {Pool } = pkg;
const pool = new Pool({
    host: 'localhost',
    user: 'laundryapp',
    password: 'laundrypassword',
    port: 5432,
    database: "laundrypay",
    max: 10,
    idleTimeoutMillis: 30000, // close idle connections
    connectionTimeoutMillis: 2000
})



export default pool;