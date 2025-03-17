const Turma = require('../models/turma.js')
const Aluno = require('../models/aluno.js')
const Professor = require('../models/professor.js')

function verificarNomeValido(nome){

  try{
    return typeof nome === "string" && nome.trim().length > 0;
  }catch(error){
    return error
  }
}

const obterTurma = async (req, res) => {
    
  try{
      const { id } = req.params;
      const turma = await Turma.findById({ _id: id });
      res.json(turma);

  } catch(error){
      res.status(500).json({ message: 'Não foi possível encontrar essa turma.', error: error.message });

  }

}

const criarTurma = async (req, res) => {
  
  try{
    const { nome, alunosIds, professorId } = req.body;

    if(!nome || !alunosIds || !professorId ){
      res.status(400).json({messsage: 'Todos os campos são obrigatórios'})
    }
  
    if(!verificarNomeValido(nome)){
      res.status(400).json({messsage: 'O nome é um campo obrigatório'})
    }

    if (!mongoose.Types.ObjectId.isValid(alunoId)) {
      return res.status(400).json({ message: "O alunoId é um campo obrigatório" });
    }
  
    const alunoIdExiste = await Aluno.findById(alunoId);
    if (!alunoIdExiste) {
      return res.status(404).json({ message: "alunoId não encontrado" });
    }

    if (!mongoose.Types.ObjectId.isValid(professorId)) {
        return res.status(400).json({ message: "O professorId é um campo obrigatório" });
    }
  
    const professorIdExiste = await Professor.findById(professorId);
    if (!professorIdExiste) {
      return res.status(404).json({ message: "professorId não encontrado" });
    }

    const novaTurma = new Turma({
      nome,
      alunos: alunosIds,
      professor: professorId,
    });
  
    await novaTurma.save();
  
    res.json({
      message: "Turma criada com sucesso!",
      turma: novaTurma,
    });

  } catch (error) {
    res.status(500).json({ message: 'Turma não foi criada.', error: error.message });
  }
};

const obterTodasTurmas = async (req, res) => {

  try{
    const turmas = await Turma.find().populate('alunos professor');
    res.json(turmas);

  } catch (error) {
    res.status(500).json({ message: 'Turma não foi encontrada.', error: error.message });
  }
};

const deletarTurma = async (req, res) => {

  try{
    const { id } = req.params;
  
    await Turma.deleteOne({ _id: id });
    res.json({ message: "Turma removida com sucesso!" });

  }catch (error) {
    res.status(500).json({ message: 'Turma não foi deletada.', error: error.message });
  }
};

const editarTurma = async (req, res) => {

  try{
    const { id } = req.params;
    const { nome, alunosIds, professorId } = req.body;


    if(!nome || !alunosIds || !professorId ){
      res.status(400).json({messsage: 'Todos os campos são obrigatórios'})
    }
  
    if(!verificarNomeValido(nome)){
      res.status(400).json({messsage: 'O nome é um campo obrigatório'})
    }

    if (!mongoose.Types.ObjectId.isValid(alunoId)) {
      return res.status(400).json({ message: "O alunoId é um campo obrigatório" });
    }
  
    const alunoIdExiste = await Aluno.findById(alunoId);
    if (!alunoIdExiste) {
      return res.status(404).json({ message: "alunoId não encontrado" });
    }

    if (!mongoose.Types.ObjectId.isValid(professorId)) {
        return res.status(400).json({ message: "O professorId é um campo obrigatório" });
    }
  
    const professorIdExiste = await Professor.findById(professorId);
    if (!professorIdExiste) {
      return res.status(404).json({ message: "professorId não encontrado" });
    }
  
    let turma = await Turma.findByIdAndUpdate(id, { nome, alunos: alunosIds, professor: professorId });
    res.status(200).json({
      message: "Turma atualizada com sucesso!",
      turma,
    });

  }catch (error) {
    res.status(500).json({ message: 'Turma não foi editada.', error: error.message });
  }
};

module.exports = { editarTurma, criarTurma, obterTodasTurmas, deletarTurma, obterTurma }