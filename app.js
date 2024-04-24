/*var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.send('Hola weies del mundo! esta es la api principal.');
});

app.get('/saludar', function(req, res){
    res.send('Hola a todos');
});

app.get('/despedir', function(req, res){
    res.send('Bai geis!');
});

app.listen(3000, function(){
    console.log('App ejemplo, escuchando el puerto 3000!');
});*/

//11 de abril del 2024
//requiere packages y set da port
const express = require('express');
const port = 3002;

const cors = require('cors');

//para permitir manejo de post y put
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const app = express();

//usar node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true,
}));

app.use(cors());

routes(app);

//iniciar el servidor
const server = app.listen(port, (error) => {
    if (error) return console.log('Error: ${error}');

    console.log('El server escucha en el puerto ${server.address().port}');
});