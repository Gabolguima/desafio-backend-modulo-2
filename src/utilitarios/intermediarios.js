const bancodedados = require("../bancodedados");

const validarSenha = (req, res, next) => {
  const { senha_banco } = req.query;

  if (!senha_banco) {
    return res.status(400).json({ mensagem: "Você não inseriu a senha!" })
  }

  else if (senha_banco !== bancodedados.banco.senha) {
    return res.status(401).json({ mensagem: "A senha do banco informada é inválida!" });
  }

  return next();
}

const validarCpfEEmail = (req, res, next) => {
  const {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha
  } = req.body;


  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
  }

  const contaCpfEEmailExistente = bancodedados.contas.some((conta) => {
    return (conta.usuario.cpf === cpf || conta.usuario.email === email);
  });

  if (contaCpfEEmailExistente) {
    return res.status(400).json({ mensagem: "Já existe uma conta com o CPF ou e-mail informado!" });
  }

  return next();
}

module.exports = {
  validarSenha,
  validarCpfEEmail
} 