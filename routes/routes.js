//cargue la conexion del grupo mysql
const { request, response } = require('express');
const pool = require('../data/config');

//ruta de la app
const router = app => {
    //mostrar mensaje de bienvenida de root
    app.get('/', (request, response) => {
        response.send({
            message: 'bienvenido a node.js express rest api'
        });
    });

    //mostrar todos los usuarios
    app.get('/users', (request, response) => {
        //response.header('Access-Control-Allow-Origin','*');
        pool.query('SELECT * FROM users', (error, result) =>{
            if (error) throw error;

            response.send(result);
        });
    });

    //mostrar un solo usuario por id
    app.get('/users/:id', (request, response)=>{
        //response.header('Access-Control-Allow-Origin','*');

        const id = request.params.id;

        pool.query('SELECT * FROM users WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            
            response.send(result);
        });
    });

    //agregar un nuevo usuario
    app.post('/users', (request, response) => {
        //response.header('Access-Control-Allow-Origin','*');

        pool.query('INSERT INTO users SET ?', request.body, (error, result) => {
            if (error) throw error;

            response.status(201).send('user agregao with ID: ${result.insertId}');
        });
    });

    app.put('/users/:id', (request, response) => {
        //response.header('Access-Control-Allow-Origin','*');
        const id = request.params.id;

        pool.query('UPDATE users SET ? WHERE id = ?', [request.body, id], (error, result) => {
            if (error) throw error;

            response.send('User actualizao bien.');
        });
    });

    app.delete('/users/:id', (request, response) => {
        //response.header('Access-Control-Allow-Origin','*');
        const id = request.params.id;

        pool.query('DELETE FROM users WHERE id = ?', id, (error, result) => {
            if (error) throw error;
            response.send('User eliminao.');
        });
    });
    //en la tabla de la bd ira un id autoincremental, nombre del ususario con el q se va a loguear el humano, y su nombre completo.
}
//exportar el router
module.exports = router;