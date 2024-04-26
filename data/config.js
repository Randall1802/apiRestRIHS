const sql = require('mssql');

const config = {
  user: 'randyapi',
  password: '1234',
  server: 'localhost', // o la dirección del servidor
  database: 'api',
  options: {
    encrypt: false, 
    enableArithAbort: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Conexión a MSSQL Server exitosa');
    return pool;
  })
  .catch(err => {
    console.error('Error al conectar a MSSQL Server:', err);
    process.exit(1);
  });

module.exports = { sql, poolPromise };