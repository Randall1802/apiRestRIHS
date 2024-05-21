//cargue la conexion del grupo mysql
const { request, response } = require('express');
const pool = require('../data/config');

var sha1 = require('js-sha1');
var { sha256, sha224 } = require('js-sha256');
var md5 = require('md5');

const encryptPasswordSHA1 = (password) => {
    return sha1(password);
};

const encryptPasswordSHA256 = (password) => {
    return sha256(password);
};


const encryptPasswordMD5 = (password) => {
    return md5(password);
};

//ruta de la app
const router = app => {
    //mostrar mensaje de bienvenida de root
    app.get('/welcome', (request, response) => {
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

        const Passwordsha256 = encryptPasswordSHA256(request.body.password);
        const Passwordsha1 = encryptPasswordSHA1(request.body.password);
        const Passwordmd5 = encryptPasswordMD5(request.body.password); 
        
        request.body.passwordsha1 = Passwordsha1;
        request.body.passwordsha256 = Passwordsha256;
        request.body.passwordmd5 = Passwordmd5;

        pool.query('INSERT INTO users SET ?', request.body, (error, result) => {
            if (error) throw error;

            response.status(201).send('user agregao with ID: ${result.insertId}');
        });
    });

    app.put('/users/:id', (request, response) => {
        //response.header('Access-Control-Allow-Origin','*');
        const id = request.params.id;

        const Passwordsha256 = encryptPasswordSHA256(request.body.password);
        const Passwordsha1 = encryptPasswordSHA1(request.body.password);
        const Passwordmd5 = encryptPasswordMD5(request.body.password); 
        
        request.body.passwordsha1 = Passwordsha1;
        request.body.passwordsha256 = Passwordsha256;
        request.body.passwordmd5 = Passwordmd5;
        
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
    
   app.get('/messages', (request, response) => {
        pool.query('SELECT user AS autor, message AS texto FROM messages', (error, result) => {
            if (error) throw error;
            response.send(result);
        });
    });

    app.post('/messages', (request, response) => {
        const { autor, texto } = request.body;
        const query = 'INSERT INTO messages (user, message) VALUES (?, ?)';

        pool.query(query, [autor, texto], (error, result) => {
            if (error) throw error;

            const newMessage = { autor, texto };
            io.sockets.emit('messages', newMessage); // Emitir el mensaje a todos los clientes

            response.status(201).send(`Message added with ID: ${result.insertId}`);
        });
    });
}
//exportar el router
module.exports = router;