const mysql = require('mysql');

//set database connection credentials
const config = {
    host: 'localhost',
    user: 'root', 
    password: '12345',
    database: 'api',
};

//create a mysql pool
const pool = mysql.createPool(config);

//export the pool
module.exports = pool;