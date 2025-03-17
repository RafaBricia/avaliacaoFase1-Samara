// ADICIONANDO A REFERÊNCIA DO ESQUEMA 'ALUNO' E 'PERFIL'
// ADICIONANDO 'PERFIL' PARA SER UM ATRIBUTO RECEBIDO AO TENTAR CRIAR 'ALUNO'
// ESTRUTURANDO CORRETAMENTE OS TRY CATCHS E OS STATUS CODE
// EXPORTANDO CORRETAMENTE CADA FUNÇÃO
// USO DE REGEX PARA VALIDAR SENHAS

const Professor = require('../models/professor.js')
const Disciplina = require('../models/disciplina.js')


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


const criarProfessor = async (req, res) => {

  try{

    const { nome, idade, senha, disciplinasIds } = req.body;
  
    if(!nome || !idade || !senha || !disciplinasIds){
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
    
    if (!mongoose.Types.ObjectId.isValid(disciplinasIds)) {
      return res.status(400).json({ message: "O disciplinasIds é um campo obrigatório" });
    }
  
    const disciplinasIdsExiste = await Disciplina.findById(disciplinasIds);
    if (!disciplinasIdsExiste) {
      return res.status(404).json({ message: "disciplina não encontrada" });
    }
  
    const novoProfessor = new Professor({
      nome,
      idade,
      disciplinas: disciplinasIds
    });
  
    await novoProfessor.save();
  
    res.status(201).json({
      message: "Professor criado com sucesso!",
      professor: novoProfessor,
    });
  } catch(error){
    res.status(500).json({ message: "Erro ao tentar editar usuário" });
  }
};

const obterTodosProfessores = async (req, res) => {

  try{
    const professores = await Professor.find().populate('disciplinas');
    res.json(professores);

  } catch(error){
    res.status(500).json({message: "Não foi possível listar ss professores.", error: error.message})
  }
};

const obterProfessor = async (req, res) => {
    
  try{
      const { id } = req.params;
      const professor = await Professor.findById({ _id: id });
      res.json(professor);

  } catch(error){
      res.status(500).json({ message: 'Não foi possível encontrar esse professor.', error: error.message });

  }

}

const deletarProfessor = async (req, res) => {
  
  try{
    
    const { id } = req.params;
  
    await Professor.deleteOne({ _id: id });
    res.json({ message: "Professor removido com sucesso!" });

  } catch(error){
    res.status(500).json({message: "Não foi possível deletar o professor.", error: error.message})
  }

};

const editarProfessor = async (req, res) => {
  try{
    const { id } = req.params;
    const { nome, idade, senha, disciplinasIds } = req.body;
  
    if(!nome || !idade || !senha || !disciplinasIds){
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
    
    if (!mongoose.Types.ObjectId.isValid(disciplinasIds)) {
      return res.status(400).json({ message: "O disciplinasIds é um campo obrigatório" });
    }
  
    const disciplinasIdsExiste = await Disciplina.findById(disciplinasIds);
    if (!disciplinasIdsExiste) {
      return res.status(404).json({ message: "disciplina não encontrada" });
    }
  
    let professor = await Professor.findByIdAndUpdate(id, { nome, idade, senha, disciplinas: disciplinasIds });
    res.status(200).json({
      message: "Professor atualizado com sucesso!",
      professor,
    });

  } catch(error){
    res.status(500).json({ message: "Erro ao tentar editar usuário" });
  }
};

module.exports = { obterTodosProfessores, obterProfessor, deletarProfessor,editarProfessor,criarProfessor }