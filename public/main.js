/*creamos la variable que va a premitir al frontend conectarse a nuestro backend */
//var io = require('socket.io')(server);

var socket = io.connect('http://localhost:3011', { 'forceNew': true}); //direccion del backend, ubuntu

/*esto manda al server el msj de connect y aparece en console.log */

/*el cliente manejara datos mediante mensajes, esto se llamaran eventos y se mostraran por consola en el navegador*/
socket.on('messages', function (data){
    console.log(data);
    render(data);
});

//creamos un template pa que nos imprima el contenido

function render(data){
    //aqui se inicia el manejo de string que viene en em6 se usan estas comillas ``
    //las variables se colocan con $ y entre {}
    //var html = `<div>
      //               <strong>${data.autor}</strong>:
        //             <em>${data.texto}</em>
          //      </div>`;

            //document.getElementById('messages').innerHTML = html;
    //reestructuramos esta seccion pa que se maneje el array. elem es un conjunto de cosas. con map recorremos el array
    var html = data.map(function (elem, index){
        return(`<div>
                     <strong>${elem.autor}</strong>:
                     <em>${elem.texto}</em>
                </div>`);}).join(" ");
    
    document.getElementById('messages').innerHTML = html;
}

//cada vez que alguien presione el boton enviar en el formulario
//el cliente emite un nuevo mensaje y manda el payload
function addMessage(e){
    var payload = {
        autor: document.getElementById('username').value,
        texto: document.getElementById('texto').value
    };
    socket.emit('new-message', payload);
    return false;
}
