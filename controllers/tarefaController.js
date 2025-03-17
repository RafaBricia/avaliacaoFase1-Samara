
const Tarefa = require('../models/tarefa.js')
const Aluno = require('../models/aluno.js')
const Disciplina = require('../models/disciplina.js')

function verificarTituloValido(titulo){

  try{
    return typeof titulo === "string" && titulo.trim().length > 0;
  }catch(error){
    return error
  }
}

const criarTarefa = async (req, res) => {

  try{
    const { titulo, alunoId, disciplinasIds } = req.body;
    const concluida = false;
  
    if(!titulo || !alunoId || !disciplinasIds){
      res.status(400).json({messsage: 'Todos os campos são obrigatórios'})
    }
  
    if(!verificarTituloValido(titulo)){
      res.status(400).json({messsage: 'O titulo é um campo obrigatório'})
    }
  
    if (!mongoose.Types.ObjectId.isValid(disciplinasIds)) {
      return res.status(400).json({ message: "O disciplinasIds é um campo obrigatório" });
    }
  
    const disciplinasIdsExiste = await Disciplina.findById(disciplinasIds);
    if (!disciplinasIdsExiste) {
      return res.status(404).json({ message: "disciplina não encontrada" });
    }
    
    if (!mongoose.Types.ObjectId.isValid(alunoId)) {
      return res.status(400).json({ message: "O alunoId é um campo obrigatório" });
    }
  
    const alunoIdExiste = await Aluno.findById(alunoId);
    if (!alunoIdExiste) {
      return res.status(404).json({ message: "alunoId não encontrado" });
    }

    if (typeof req.body.concluida !== 'boolean') {
      return res.status(400).json({ message: "O campo 'concluida' é obrigatório e deve ser um booleano (true ou false)." });
    }    

    const novaTarefa = new Tarefa({
      titulo,
      aluno: alunoId,
      concluida,
      disciplinas: disciplinasIds,
    });
  
    await novaTarefa.save();
  
    res.json({
      message: "Tarefa criada com sucesso!",
      tarefa: novaTarefa,
    });

  } catch (error) {
    res.status(500).json({ message: 'Tarefa não foi criada.', error: error.message });
  }

};

const obterTarefa = async (req, res) => {
    
  try{
      const { id } = req.params;
      const tarefa = await Tarefa.findById({ _id: id });
      res.json(tarefa);

  } catch(error){
      res.status(500).json({ message: 'Não foi possível encontrar essa tarefa.', error: error.message });

  }

}

const obterTodasTarefas = async (req, res) => {

  try{
    const tarefas = await Tarefa.find().populate("aluno").populate("disciplinas");
    res.json(tarefas);

  }  catch (error) {
    res.status(500).json({ message: 'Tarefas não foram listadas.', error: error.message });
  }
};

const deletarTarefa = async (req, res) => {

  try{
    const { id } = req.params;
  
    await Tarefa.deleteOne({ _id: id });
    res.json({ message: "Tarefa removida com sucesso!" });

  } catch (error) {
    res.status(500).json({ message: 'Tarefa não foi deletada.', error: error.message });
  }
};

const editarTarefa = async (req, res) => {

  try{
    
      const { id } = req.params;
      const { titulo, concluida,disciplinasIds, alunoId} = req.body;
    
      if(!titulo || !alunoId || !disciplinasIds){
        res.status(400).json({messsage: 'Todos os campos são obrigatórios'})
      }
    
      if(!verificarTituloValido(titulo)){
        res.status(400).json({messsage: 'O titulo é um campo obrigatório'})
      }
    
      if (!mongoose.Types.ObjectId.isValid(disciplinasIds)) {
        return res.status(400).json({ message: "O disciplinasIds é um campo obrigatório" });
      }
    
      const disciplinasIdsExiste = await Disciplina.findById(disciplinasIds);
      if (!disciplinasIdsExiste) {
        return res.status(404).json({ message: "disciplina não encontrada" });
      }
      
      if (!mongoose.Types.ObjectId.isValid(alunoId)) {
        return res.status(400).json({ message: "O alunoId é um campo obrigatório" });
      }
    
      const alunoIdExiste = await Aluno.findById(alunoId);
      if (!alunoIdExiste) {
        return res.status(404).json({ message: "alunoId não encontrado" });
      }

      if (typeof req.body.concluida !== 'boolean') {
        return res.status(400).json({ message: "O campo 'concluida' é obrigatório e deve ser um booleano (true ou false)." });
      }
      

      let tarefa = await Tarefa.findByIdAndUpdate(id, { titulo, concluida,alunoId, disciplinasIds});
      res.status(200).json({
        message: "Tarefa atualizada com sucesso!",
        tarefa,
      });
   

  } catch (error) {
    res.status(500).json({ message: 'Tarefa não foi atualizada.', error: error.message });
  }

};

module.exports = { obterTodasTarefas, obterTarefa, criarTarefa, deletarTarefa, editarTarefa }
