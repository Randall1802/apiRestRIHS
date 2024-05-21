const mysql = require('mysql');

//set database connection credentials
const config = {
    host: 'localhost',
    user: 'root', 
    password: '12345',
    database: 'api'//,
    //waitForConnections: true,
    //connectionLimit: 100,
    //queueLimit: 0
};

//create a mysql pool
const pool = mysql.createPool(config);

//export the pool
module.exports = pool;