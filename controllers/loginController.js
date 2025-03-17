const jwt = require("jsonwebtoken");
const Aluno = require("../models/aluno.js");
const Professor = require("../models/professor.js");
const mongoose = require("mongoose");

require('dotenv').config();

const secret = process.env.JWT_SECRET;

const loginAluno = async (req, res) => {

    const { _id, nome, senha } = req.body;

    try {

        if (!_id || !senha || !nome) {
            return res.status(400).json({ message: "Os campos são obrigatórios" });
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: "ID inválido" });
        }
        
        let aluno = await Aluno.findOne({ _id });

        if(!aluno) {
            return res.status(400).json({ message: "Aluno não cadastrado" })

        }

        aluno.isCorrectPassword(senha, function(err, same) {

            // if(!same) {
            //     return res.status(401).json({ message: "senha inválida" })
            // }

            const token = jwt.sign({ id: aluno._id }, secret, { expiresIn: '1h' }); 
            return res.status(200).json({ message: "Login realizado com sucesso", aluno,token });
        });

    } catch (err) {
        return res.status(500).json({ message: "Erro ao buscar aluno" });
    }
}


const loginProf = async (req, res) => {
    const { _id, nome, senha } = req.body;

    try {

        if (!_id || !senha || !nome) {
            return res.status(400).json({ message: "Os campos são obrigatórios" });
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        let professor = await Professor.findById(_id);
        if (!professor) {
            return res.status(400).json({ message: "Professor não encontrado" });
        }


        const token = jwt.sign({ id: professor._id }, secret, { expiresIn: '1h' });
        return res.status(200).json({ message: "Login realizado com sucesso", professor, token });

    } catch (err) {
        return res.status(500).json({ message: "Erro ao buscar professor", error: err.message });
    }
};

module.exports = { loginAluno, loginProf };