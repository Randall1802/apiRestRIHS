var express = require('express');
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
});