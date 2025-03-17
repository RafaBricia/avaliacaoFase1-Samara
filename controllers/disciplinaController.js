// ADICIONANDO A REFERÊNCIA DO ESQUEMA 'ALUNO' E 'PERFIL'
// ADICIONANDO 'PERFIL' PARA SER UM ATRIBUTO RECEBIDO AO TENTAR CRIAR 'ALUNO'
// ESTRUTURANDO CORRETAMENTE OS TRY CATCHS E OS STATUS CODE
// EXPORTANDO CORRETAMENTE CADA FUNÇÃO
// USO DE REGEX PARA VALIDAR SENHAS

const Disciplina = require('../models/disciplina.js')
const Tarefa = require('../models/tarefa.js')
const moment = require("moment");

function verificarStringValido(stg){

  try{
    return typeof stg === "string" && stg.trim().length > 0;
  }catch(error){
    return error
  }
}


function verificarData(data) {
    return moment(data, "DD--MM--YYYY", true).isValid();
}


const criarDisciplina = async (req, res) => {

  try{

    const { nome, descricao, dataInicio, dataFim, tarefasIds } = req.body;
  
    if(!nome || !descricao || !dataInicio || !dataFim || !tarefasIds){
      res.status(400).json({messsage: 'Todos os campos são obrigatórios'})
    }
  
    if(!verificarStringValido(nome)){
      res.status(400).json({messsage: 'O nome é um campo obrigatório'})
    }
  
  
    if(!verificarStringValido(descricao)){
      res.status(400).json({messsage: 'A descrição é um campo obrigatório'})
    }
  
  
    if(!verificarData(dataInicio)){
      res.status(400).json({messsage: 'A dataInicio é um campo obrigatório'})
    }
    
    if(!verificarData(dataFim)){
      res.status(400).json({messsage: 'A dataFim é um campo obrigatório'})
    }
  
  
    if (!mongoose.Types.ObjectId.isValid(Tarefa)) {
      return res.status(400).json({ message: "O tarefasIds é um campo obrigatório" });
    }
  
    const tarefasIdsExiste = await Tarefa.findById(tarefasIds);
    if (!tarefasIdsExiste) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }
  
  
    const novaDisciplina = new Disciplina({
      nome,
      descricao,
      dataInicio,
      dataFim,
      tarefas: tarefasIds,
    });
  
    await novaDisciplina.save();
  
    // Atualiza as tarefas associadas à disciplina
    await Tarefa.updateMany(
      { _id: { $in: tarefasIds } },
      { $push: { disciplinas: novaDisciplina._id } }
    );
  
    res.json({
      message: "Disciplina criada com sucesso!",
      disciplina: novaDisciplina,
    });
  } catch(error){
    res.status(500).json({ message: "Erro ao tentar cadastrar disciplina" });

  }
};

const obterDisiciplina = async (req, res) => {
    
  try{
      const { id } = req.params;
      const disciplina = await Disciplina.findById({ _id: id });
      res.json(disciplina);

  } catch(error){
      res.status(500).json({ message: 'Não foi possível encontrar essa disciplina.', error: error.message });

  }

}

const obterTodasDisciplinas = async (req, res) => {
  
  try{
    const disciplinas = await Disciplina.find().populate('tarefas');
    res.json(disciplinas);
    
  } catch(error){
    res.status(500).json({ message: "Erro ao tentar listar as disciplinas" });
  }
};

const deletarDisciplina = async (req, res) => {
 
  try{ 
    const { id } = req.params;

    await Disciplina.deleteOne({ _id: id });
    res.json({ message: "Disciplina removida com sucesso!" });
  } catch(error){
    res.status(500).json({ message: "Erro ao tentar listar as disciplinas" });
  }
};

const editarDisciplina = async (req, res) => {
  try{

    const { nome, descricao, dataInicio, dataFim, tarefasIds } = req.body;
  
    if(!nome || !descricao || !dataInicio || !dataFim || !tarefasIds){
      res.status(400).json({messsage: 'Todos os campos são obrigatórios'})
    }
  
    if(!verificarStringValido(nome)){
      res.status(400).json({messsage: 'O nome é um campo obrigatório'})
    }
  
  
    if(!verificarStringValido(descricao)){
      res.status(400).json({messsage: 'A descrição é um campo obrigatório'})
    }
  
  
    if(!verificarData(dataInicio)){
      res.status(400).json({messsage: 'A dataInicio é um campo obrigatório'})
    }
    
    if(!verificarData(dataFim)){
      res.status(400).json({messsage: 'A dataFim é um campo obrigatório'})
    }
  
  
    if (!mongoose.Types.ObjectId.isValid(tarefasIds)) {
      return res.status(400).json({ message: "O tarefasIds é um campo obrigatório" });
    }
  
    const tarefasIdsExiste = await Tarefa.findById(tarefasIds);
    if (!tarefasIdsExiste) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }



    let disciplina = await Disciplina.findByIdAndUpdate(id, { nome, descricao, dataInicio, dataFim, tarefas: tarefasIds });
    res.status(200).json({
      message: "Disciplina atualizada com sucesso!",
      disciplina,
    });
  }catch(error){
    res.status(500).json({ message: "Erro ao tentar atualizar a disciplina" });

  }
};

module.exports = { criarDisciplina, obterTodasDisciplinas, deletarDisciplina, obterDisiciplina, editarDisciplina }