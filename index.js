var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.send('Hola weies del mundo!');
});

app.listen(3000, function(){
    console.log('App ejemplo, escuchando el puerto 3000!');
});