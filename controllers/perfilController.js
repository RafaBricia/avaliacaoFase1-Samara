const Perfil = require('../models/perfil.js')
const Aluno = require('../models/aluno.js')

function validarMatricula(matricula) {
  const regex = /^\d{4,10}$/;
  return regex.test(matricula);
}

function validarTelefone(telefone) {
  const regex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  return regex.test(telefone);
}

function validarEndereco(endereco) {
  const regex = /^[A-Za-zÀ-ú\s]+ \d*$/;
  return regex.test(endereco);
}

const criarPerfil = async (req, res) => {
  try{
    const { matricula, telefone, endereco, alunoId } = req.body;

    if (!matricula || !telefone || !endereco || !alunoId) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    if(!validarMatricula(matricula)){
      res.status(400).json({messsage: 'A Matricula é um campo obrigatório'})
    }


    if(!validarTelefone(telefone)){
      res.status(400).json({messsage: 'o telefone é um campo obrigatório'})
    }

    if(!validarEndereco(endereco)){
      res.status(400).json({messsage: 'O endereço é um campo obrigatório'})
    }

  
    if (!mongoose.Types.ObjectId.isValid(alunoId)) {
      return res.status(400).json({ message: "O alunoId é um campo obrigatório" });
    }
  
    const alunoIdExiste = await Aluno.findById(alunoId);
    if (!alunoIdExiste) {
      return res.status(404).json({ message: "alunoId não encontrado" });
    }
  
    const novoPerfil = new Perfil({
      matricula,
      telefone,
      endereco,
      aluno: alunoId,
    });

    await novoPerfil.save();

    await Aluno.updateOne(
      { _id: alunoId },
      { $set: { perfil: novoPerfil._id } }
    );

    res.json({
      message: "Perfil criado com sucesso!",
      perfil: novoPerfil,
    })
  }catch(error){
    res.status(500).json({ message: 'Não foi possível criar perfis.', error: error.message });

  }
};

const obterPerfil = async (req, res) => {
    
  try{
      const { id } = req.params;
      const perfil = await Perfil.findById({ _id: id });
      res.json(perfil);

  } catch(error){
      res.status(500).json({ message: 'Não foi possível encontrar esse perfil.', error: error.message });

  }

}

const obterTodosPerfis = async (req, res) => {

  try{
    
      const perfis = await Perfil.find().populate('aluno');
      res.json(perfis);

  } catch(error){
    res.status(500).json({ message: 'Não foi possível encontrar perfis.', error: error.message });

  }

};

const deletarPerfil = async (req, res) => {

  try{
    
      const { id } = req.params;
    
      await Perfil.deleteOne({ _id: id });
      res.json({ message: "Perfil removido com sucesso!" });

  } catch(error){
    res.status(500).json({ message: 'Não foi possível encontrar perfis.', error: error.message });

  }
};

const editarPerfil = async (req, res) => {

  try{
    const { id } = req.params;
    const { matricula, telefone, endereco, alunoId } = req.body;
  
    if (!matricula || !telefone || !endereco || !alunoId) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    if(!validarMatricula(matricula)){
      res.status(400).json({messsage: 'A Matricula é um campo obrigatório'})
    }


    if(!validarTelefone(telefone)){
      res.status(400).json({messsage: 'o telefone é um campo obrigatório'})
    }

    if(!validarEndereco(endereco)){
      res.status(400).json({messsage: 'O endereço é um campo obrigatório'})
    }

  
    if (!mongoose.Types.ObjectId.isValid(alunoId)) {
      return res.status(400).json({ message: "O alunoId é um campo obrigatório" });
    }
  
    const alunoIdExiste = await Aluno.findById(alunoId);
    if (!alunoIdExiste) {
      return res.status(404).json({ message: "alunoId não encontrado" });
    }


    let perfil = await Perfil.findByIdAndUpdate(id, { matricula, telefone, endereco, aluno: alunoId });
    res.status(200).json({
      message: "Perfil atualizado com sucesso!",
      perfil,
    });

  } catch(error){
    res.status(500).json({ message: 'Não foi possível encontrar perfis.', error: error.message });

  }

};

module.exports = { criarPerfil, obterPerfil, obterTodosPerfis, editarPerfil, deletarPerfil }