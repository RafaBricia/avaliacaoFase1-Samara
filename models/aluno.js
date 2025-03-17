// INSTALANDO BIBLIOTECA BCRYPTO PARA CODIFICAR A SENHA
// ADICIONANDO UM ATRIBUTO 'SENHA' PARA SER CODIFICADA
// REALIZANDO O PROCESSO DE HASH ATRAVÉS DE FUNÇÕES 

let mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

let alunoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  idade: { type: Number, required: true, min: 15, max: 99 },
  senha: { type: String, required:true },
  perfil: { type: mongoose.Schema.Types.ObjectId, ref: "Perfil" },
 
});

alunoSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('senha')) {
    try {
      const hashedPassword = await bcrypt.hash(this.senha, 10);
      this.senha = hashedPassword;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

alunoSchema.methods.isCorrectPassword = function(password, callback) {
  bcrypt.compare(password, this.senha, function(err, same) {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
};

module.exports = mongoose.model("Aluno", alunoSchema);


