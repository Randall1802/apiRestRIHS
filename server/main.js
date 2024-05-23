var express = require("express");
var app = express();

const cors = require("cors");

//para permitir manejo de post y put
const bodyParser = require("body-parser");
const routes = require("../routes/routes.js");
const pool = require("../data/config");

//usar node.js body parsing middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/*como trabajaremos con socket, es recomendable usar el modulo HTTP para pasarle la app a express y manejar bien http*/
var server = require("http").Server(app);

/*aqui estara toda la funcionalidad de los sockets
  se requiere la libreria socket.io
  se pasa la variable server que tiene la app express y HTTP
*/
var io = require("socket.io")(server, {
  cors: {
    origin: "*", // Dirección del servidor frontend
    methods: ["GET", "POST"],
  },
});

/*usamos un middleware pa usar elementos estaticos en la seccion publica de la aplicacion*/
app.use(express.static("public"));

const corsOptions = {
  origin: "*", // Reemplaza con la dirección del servidor de tu frontend
  methods: ["GET", "POST"], // Métodos HTTP permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
};

app.use(cors(corsOptions));

routes(app, io);

/*de esta forma activamos socket pa que escuche. mandamos un msj de control por consola pa saber q pasa y tenemos q hacer q el msj venga del nav web mediante html y js*/
io.on("connection", function (socket) {
  console.log("Alguien se ha conectado con sockets");
  pool.query("SELECT user AS autor, message AS texto FROM messages",(error, result) => {
      if (error) throw error;

      socket.emit("messages", result);
    }
  );
  //ahora queremos escuchat los msjs mandados por el cliente
  socket.on("new-message", (data) => {
    const query = "INSERT INTO messages (user, message) VALUES (?, ?)";
    const values = [data.autor, data.texto];

    pool.query(query, values, (error, result) => {
      if (error) throw error;

      console.log("Message inserted into database with ID:", result.insertId);

      // Emitir los mensajes actualizados a todos los clientes
      pool.query("SELECT user AS autor, message AS texto FROM messages", (error, result) => {
          if (error) throw error;

          io.sockets.emit("messages", result);
        }
      );
    });
  });
});

server.listen(3012, function () {
  console.log("el server esta corriendo en http://localhost:3012");
});
