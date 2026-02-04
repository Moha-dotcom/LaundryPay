import pkg from 'pg'
const {Pool } = pkg;
const pool = new Pool({
    host: 'localhost',
    user: 'colab_app',
    password: 'colab_password',
    port: 5432,
    database: "colab",
    max: 10,
    idleTimeoutMillis: 30000, // close idle connections
    connectionTimeoutMillis: 2000
})

export default pool;