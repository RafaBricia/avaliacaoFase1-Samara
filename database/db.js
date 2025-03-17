const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Professor = require('../models/professor.js');

const server = 'localhost:27017';
const database = 'avaliacao1';

function criarProfessorPadrao() {
  Professor.find()
    .then((professores) => {
      if (professores.length === 0) { 
        return bcrypt.hash("teste123", 10); 
      } else {
        throw new Error("Já existem professores no banco de dados.");
      }
    })
    .then((hashedPassword) => {
      return Professor.create({ 
        nome: "Professor Padrão",
        idade: 40,
        senha: hashedPassword,
        disciplinas: []
      });
    })
    .then(() => {
      console.log("Professor padrão criado com sucesso!");
    })
    .catch((error) => {
      if (error.message === "Já existem professores no banco de dados.") {
        console.log(error.message);
      } else {
        console.error("Erro ao criar professor padrão:", error);
      }
    });
}

mongoose.connect(`mongodb://${server}/${database}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conectado ao banco de dados com sucesso.');
    criarProfessorPadrao(); 
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });