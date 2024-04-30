const { req, res } = require('express');
const {sql , poolPromise}= require('../data/config');
var sha1 = require('js-sha1');
var sha256 = require('js-sha256');
var md5 = require('js-md5');
const { MAX } = require('mssql');

//ruta de la app
const router = app => {
    //mostrar mensaje de bienvenida de root
    app.get('/', (req, res) => {
        res.send({
            message: 'bienvenido a node.js express rest api'
        });
    });

    //mostrar todos los usuarios
    app.get('/users', async (req, res) => {
        try {
          const pool = await poolPromise;
          const result = await pool.request().query('SELECT * FROM users');
          res.json(result.recordset);
        } catch (err) {
          console.error('Error al obtener datos:', err);
          res.status(500).send('Error al obtener datos');
        }
    });

    // Mostrar un solo usuario por id
    app.get('/users/:id', async (req, res) => {
        try {
        const pool = await poolPromise;
        const id = req.params.id;
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM users WHERE id = @id');
    
        res.json(result.recordset);
        } catch (err) {
        console.error('Error al obtener usuario por ID:', err);
        res.status(500).send('Error al obtener usuario por ID');
        }
    });
    
    // Agregar un nuevo usuario
    app.post('/users', async (req, res) => {
        try {
        const password = req.body.password;
        const passwordsha1 = req.body.password;
        const passwordsha256 = req.body.password;
        const passwormd5 = req.body.password;

        const passwordsha1enviar = sha1(passwordsha1);
        const passwordsha256enviar = sha256(passwordsha256);
        const passwormd5enviar = md5(passwormd5);

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('nombreUsuario', sql.NVarChar(255), req.body.nombreUsuario)
            .input('nombreReal', sql.NVarChar(255), req.body.nombreReal)

            .input('passwordsha1', sql.NVarChar(MAX), passwordsha1enviar)
            .input('passwordsha256', sql.NVarChar(MAX), passwordsha256enviar)
            .input('passwordmd5', sql.NVarChar(MAX), passwormd5enviar)
            .input('password', sql.NVarChar(MAX), password)

            .query('INSERT INTO users (nombreUsuario, nombreReal, passwordsha1, passwordsha256, passwordmd5, password) VALUES (@nombreUsuario, @nombreReal, @passwordsha1, @passwordsha256, @passwordmd5, @password)');
    
        res.status(201).send(`Usuario agregado con ID: ${result.rowsAffected}`);
        } catch (err) {
        console.error('Error al agregar usuario:', err);
        res.status(500).send('Error al agregar usuario');
        }
    });
    
    // Actualizar un usuario por id
    app.put('/users/:id', async (req, res) => {
        try {
        const password = req.body.password;
        const passwordsha1 = req.body.password;
        const passwormd5 = req.body.password;
        const passwordsha256 = req.body.password;
        const passwordsha1enviar = sha1(passwordsha1);
        const passwordsha256enviar = sha256(passwordsha256);
        const passwormd5enviar = md5(passwormd5);
        const pool = await poolPromise;
        const id = req.params.id;
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .input('nombreUsuario', sql.NVarChar(255), req.body.nombreUsuario)
            .input('nombreReal', sql.NVarChar(255), req.body.nombreReal)
            .input('passwordsha1', sql.NVarChar(MAX), passwordsha1enviar)
            .input('passwordsha256', sql.NVarChar(MAX), passwordsha256enviar)
            .input('passwordmd5', sql.NVarChar(MAX), passwormd5enviar)
            .input('password', sql.NVarChar(MAX), password)

            .query('UPDATE users SET nombreUsuario = @nombreUsuario, nombreReal = @nombreReal, passwordsha1 = @passwordsha1, passwordsha256 = @passwordsha256, passwordmd5 = @passwordmd, password = @password WHERE id = @id');
    
        res.send('Usuario actualizado correctamente.');
        } catch (err) {
        console.error('Error al actualizar usuario:', err);
        res.status(500).send('Error al actualizar usuario');
        }
    });
    
    // Eliminar un usuario por id
    app.delete('/users/:id', async (req, res) => {
        try {
        const pool = await poolPromise;
        const id = req.params.id;
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query('DELETE FROM users WHERE id = @id');
    
        res.send('Usuario eliminado correctamente.');
        } catch (err) {
        console.error('Error al eliminar usuario:', err);
        res.status(500).send('Error al eliminar usuario');
        }
    });
    //en la tabla de la bd ira un id autoincremental, nombre del ususario con el q se va a loguear el humano, y su nombre completo.
}
//exportar el router
module.exports = router;