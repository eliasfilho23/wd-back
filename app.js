const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes"); // Importing the routes
const connection = require("./db"); // Importing the database connection
const cors = require("cors");

const app = express();
const port = 3000; // Server port
app.use(cors());
// Configuring body parser for JSON
app.use(bodyParser.json());

// Using the routes defined in routes.js
app.use("/api", routes);

// Connecting to the database before starting the server
connection.getConnection((error) => {
  if (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
    process.exit(1); // Exit the process if unable to connect to the database
  }
  console.log("Conectado ao banco de dados MySQL!");

  // Starting the server
  app.listen(port, () => {
    console.log(`Servidor em execução na porta ${port}`);
  });
});
