const bancodedados = require("../bancodedados");

const listarContas = (req, res) => {
  return res.status(200).json(bancodedados.contas);
}

const criarConta = (req, res) => {
  const {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha
  } = req.body;

  const novaConta = {
    numero: (bancodedados.contas.length + 1).toString(),
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha
    }
  }

  bancodedados.contas.push(novaConta);

  return res.status(201).json();
}

const atualizarContaUsuario = (req, res) => {
  const { numeroConta } = req.params;
  const {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha
  } = req.body;

  const indiceDaConta = bancodedados.contas.findIndex((conta) => {
    return conta.numero === numeroConta;
  });

  if (indiceDaConta === -1) {
    return res.status(404).json({ mensagem: "A conta não foi encontrada." });
  }

  const conta = bancodedados.contas[indiceDaConta];
  conta.usuario = {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha
  };

  bancodedados.contas[indiceDaConta] = conta;

  return res.status(204).json();
}

const excluirConta = (req, res) => {
  const { numeroConta } = req.params;

  const indiceDaConta = bancodedados.contas.findIndex((conta) => {
    return conta.numero === numeroConta;
  });

  if (indiceDaConta === -1) {
    return res.status(404).json({ mensagem: "A conta não foi encontrada." });
  }

  const conta = bancodedados.contas[indiceDaConta];

  if (conta.saldo !== 0) {
    return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
  }

  const contasRestantes = bancodedados.contas.filter((conta) => {
    return conta.numero !== numeroConta;
  });

  bancodedados.contas = contasRestantes;

  return res.status(204).json();
}

const realizarDepositoConta = (req, res) => {
  const {
    numero_conta,
    valor
  } = req.body;

  const indiceDaConta = bancodedados.contas.findIndex((conta) => {
    return conta.numero === numero_conta;
  });

  const valorDoDeposito = Number(valor);

  if (!numero_conta || valorDoDeposito <= 0) {
    return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" });
  }

  if (indiceDaConta === -1) {
    return res.status(404).json({ mensagem: "A conta não foi encontrada." });
  }

  bancodedados.contas[indiceDaConta].saldo += valorDoDeposito;

  const registroDoDeposito = {
    data: new Date().toISOString(),
    numero_conta,
    valor: valorDoDeposito
  }

  bancodedados.depositos.push(registroDoDeposito);

  return res.status(204).json();
}

const sacarConta = (req, res) => {
  const {
    numero_conta,
    valor,
    senha
  } = req.body;

  const indiceDaConta = bancodedados.contas.findIndex((conta) => {
    return conta.numero === numero_conta;
  });

  const valorDoSaque = Number(valor);

  const conta = bancodedados.contas[indiceDaConta];

  if (!numero_conta || valorDoSaque <= 0 || !senha) {
    return res.status(400).json({ mensagem: "O número da conta, o valor do saque e a senha são obrigatórios!" });
  }

  if (indiceDaConta === -1) {
    return res.status(404).json({ mensagem: "A conta não foi encontrada." });
  }

  if (conta.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: "A senha está incorreta." });
  }

  if (valorDoSaque > conta.saldo) {
    return res.status(400).json({ mensagem: "Saldo insuficiente para saque" });
  }

  conta.saldo -= valorDoSaque;
  const registroDoSaque = {
    data: new Date().toISOString(),
    numero_conta,
    valor: valorDoSaque
  }

  bancodedados.saques.push(registroDoSaque);

  return res.status(204).json();
}

const transferenciaConta = (req, res) => {
  const {
    numero_conta_origem,
    numero_conta_destino,
    valor,
    senha
  } = req.body;

  const indiceDaContaDeOrigem = bancodedados.contas.findIndex((conta) => {
    return conta.numero === numero_conta_origem;
  });
  const indiceDaContaDeDestino = bancodedados.contas.findIndex((conta) => {
    return conta.numero === numero_conta_destino;
  });

  const valorTransferencia = Number(valor);

  if (!numero_conta_origem || !numero_conta_destino || valorTransferencia <= 0 || !senha) {
    return res.status(400).json({ mensagem: "O número da conta de origem e da conta de destino, o valor da transferência e a senha são obrigatórios!" });
  }

  if (indiceDaContaDeOrigem === -1) {
    return res.status(404).json({ mensagem: "A conta de origem não foi encontrada." });
  }

  if (indiceDaContaDeDestino === -1) {
    return res.status(404).json({ mensagem: "A conta de destino não foi encontrada." });
  }

  let contaDeOrigem = bancodedados.contas[indiceDaContaDeOrigem];
  let contaDeDestino = bancodedados.contas[indiceDaContaDeDestino];

  if (contaDeOrigem.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: "A senha está incorreta." });
  }

  if (valorTransferencia > contaDeOrigem.saldo) {
    return res.status(400).json({ mensagem: "Saldo insuficiente para a transferência" });
  }

  contaDeOrigem.saldo -= valorTransferencia;
  contaDeDestino.saldo += valorTransferencia;

  const registroDaTransferencia = {
    data: new Date().toISOString(),
    numero_conta_origem,
    numero_conta_destino,
    valor: valorTransferencia
  }

  bancodedados.transferencias.push(registroDaTransferencia);

  return res.status(204).json();
}

const consultarSaldoConta = (req, res) => {
  const {
    numero_conta,
    senha
  } = req.query;

  if (!numero_conta || !senha) {
    return res.status(400).json({ mensagem: "O número da conta e a senha são obrigatórios!" });
  }

  const indiceDaConta = bancodedados.contas.findIndex((conta) => {
    return conta.numero === numero_conta;
  });

  if (indiceDaConta === -1) {
    return res.status(404).json({ mensagem: "A conta bancária não foi encontrada." });
  }

  const conta = bancodedados.contas[indiceDaConta];

  if (conta.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: "A senha está incorreta." });
  }

  const saldo = conta.saldo;

  return res.status(200).json({ saldo });
}

const consultarExtratoConta = (req, res) => {
  const {
    numero_conta,
    senha
  } = req.query;

  if (!numero_conta || !senha) {
    return res.status(400).json({ mensagem: "O número da conta e a senha são obrigatórios!" });
  }

  const indiceDaConta = bancodedados.contas.findIndex((conta) => {
    return conta.numero === numero_conta;
  });

  if (indiceDaConta === -1) {
    return res.status(404).json({ mensagem: "A conta bancária não foi encontrada." });
  }

  const conta = bancodedados.contas[indiceDaConta];

  if (conta.usuario.senha !== senha) {
    return res.status(401).json({ mensagem: "A senha está incorreta." });
  }

  const extrato = {
    depositos: bancodedados.depositos.filter((dep) => dep.numero_conta === numero_conta),
    saques: bancodedados.saques.filter((saq) => saq.numero_conta === numero_conta),
    transferenciasEnviadas: bancodedados.transferencias.filter((transf) => transf.numero_conta_origem === numero_conta),
    transferenciasRecebidas: bancodedados.transferencias.filter((transf) => transf.numero_conta_destino === numero_conta)
  }

  return res.status(200).json(extrato);
}

module.exports = {
  listarContas,
  criarConta,
  atualizarContaUsuario,
  excluirConta,
  realizarDepositoConta,
  sacarConta,
  transferenciaConta,
  consultarSaldoConta,
  consultarExtratoConta
}
