const express = require("express");
const {
  listarContas,
  criarConta,
  atualizarContaUsuario,
  excluirConta,
  realizarDepositoConta,
  sacarConta,
  transferenciaConta,
  consultarSaldoConta,
  consultarExtratoConta,
  realizarDeposito
} = require("./controladores/contaBancaria");

const {
  validarSenha,
  validarCpfEEmail
} = require("./utilitarios/intermediarios");

const rotas = express();

rotas.get(
  "/contas",
  validarSenha, listarContas
);

rotas.post(
  "/contas",
  validarCpfEEmail, criarConta
);

rotas.put(
  "/contas/:numeroConta/usuario",
  validarCpfEEmail, atualizarContaUsuario
);

rotas.delete(
  "/contas/:numeroConta",
  excluirConta
);

rotas.get(
  "/contas/saldo",
  consultarSaldoConta
);

rotas.get(
  "/contas/extrato",
  consultarExtratoConta
);

rotas.post(
  "/transacoes/depositar",
  realizarDepositoConta
);

rotas.post(
  "/transacoes/sacar",
  sacarConta
);

rotas.post(
  "/transacoes/transferir",
  transferenciaConta
);

module.exports = rotas;