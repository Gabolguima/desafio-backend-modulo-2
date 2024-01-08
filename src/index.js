const express = require("express");
const rotas = require("./roteadores");

const app = express();
const porta = 3000;

app.use(express.json());
app.use(rotas);

app.listen(porta,
  console.log(`Servidor rodando na porta ${porta}.`)
);