// ADICIONANDO A REFERÊNCIA DO ESQUEMA 'ALUNO' E 'PERFIL'
// ADICIONANDO 'PERFIL' PARA SER UM ATRIBUTO RECEBIDO AO TENTAR CRIAR 'ALUNO'
// ESTRUTURANDO CORRETAMENTE OS TRY CATCHS E OS STATUS CODE
// EXPORTANDO CORRETAMENTE CADA FUNÇÃO
// USO DE REGEX PARA VALIDAR SENHAS

const Aluno = require('../models/aluno.js')
const Perfil = require('../models/perfil.js')


function verificarNomeValido(nome){

  try{
    return typeof nome === "string" && nome.trim().length > 0;
  }catch(error){
    return error
  }
}


function verificarIdadeValido(idade){

  try{
    return typeof idade === 'number' && Number.isInteger(idade)
  }catch(error){
    return error
  }
}
 

function validarSenha(senha) {
  try{
      const regex = /^(?=.*[a-zA-Z])(?=.*\d).{6,10}$/; 
      return regex.test(senha);

  }catch(error){
      return error

  }
}

const criarAluno = async (req, res) => {
  const { nome, idade, senha, perfil } = req.body;

  try{
    
    if(!nome || !idade || !senha || !perfil){
      res.status(400).json({messsage: 'Todos os campos são obrigatórios'})
    }

    if(!verificarNomeValido(nome)){
      res.status(400).json({messsage: 'O nome é um campo obrigatório'})
    }

    if(!verificarIdadeValido(idade)){
      res.status(400).json({messsage: 'A idade é um campo obrigatório'})
    }

    if(!validarSenha(senha)){
      res.status(400).json({messsage: 'A senha é um campo obrigatório'})
    }
    

    if (!mongoose.Types.ObjectId.isValid(perfil)) {
      return res.status(400).json({ message: "O perfil é um campo obrigatório" });
    }

    const perfilExiste = await Perfil.findById(perfil);
    if (!perfilExiste) {
      return res.status(404).json({ message: "Perfil não encontrado" });
    }
    
      const novoAluno = new Aluno({
        nome,
        idade,
        perfil
      });
    
      await novoAluno.save();
    
      res.status(201).json({
        message: "Aluno criado com sucesso!",
        aluno: novoAluno,
      });

  } catch(error){
    res.status(500).json({messsage: 'Erro ao criar aluno'})
  }
};

const obterTodosAlunos = async (req, res) => {

  try {
    const alunos = await Aluno.find().populate('perfil');
    res.json(alunos);

  } catch (error) {
    res.status(500).json({
      message: "Não foi possível listar os alunos.",
      error: error.message,
    });
  }

};

const obterAluno = async (req, res) => {
    
  try{
      const { id } = req.params;
      const aluno = await Aluno.findById({ _id: id });
      res.json(aluno);

  } catch(error){
      res.status(500).json({ message: 'Não foi possível encontrar esse aluno.', error: error.message });

  }

}


const deletarAluno = async (req, res) => {
  
    try {
      const { id } = req.params;
    
      await Aluno.deleteOne({ _id: id });
      res.json({ message: 'Aluno removido com sucesso!' });
      
  } catch (error) {
      res.status(500).json({ message: 'Não foi possível deletar o aluno.' });
  }

};

const editarAluno = async (req, res) => {
  const { id } = req.params;
  const { nome, idade, perfil } = req.body;

  try{
    
    if(!nome || !idade || !perfil){
      res.status(400).json({messsage: 'Todos os campos são obrigatórios'})
    }

    if(!verificarNomeValido(nome)){
      res.status(400).json({messsage: 'O nome é um campo obrigatório'})
    }

    if(!verificarIdadeValido(idade)){
      res.status(400).json({messsage: 'A idade é um campo obrigatório'})
    }

    if (!mongoose.Types.ObjectId.isValid(perfil)) {
      return res.status(400).json({ message: "O perfil é um campo obrigatório" });
    }

    const perfilExiste = await Perfil.findById(perfil);
    if (!perfilExiste) {
      return res.status(404).json({ message: "Perfil não encontrado" });
    }

  let aluno = await Aluno.findByIdAndUpdate(id, { nome, idade, perfil });

  res.status(200).json({
    message: 'Aluno atualizado com sucesso!',
    aluno,
    perfil
  });

  } catch(error){
    res.status(500).json({messsage: 'Erro ao criar aluno'})
  }
};

module.exports = { obterTodosAlunos,deletarAluno,editarAluno,criarAluno, obterAluno }