const express = require("express");
const router = express.Router();
const alunoController = require("../controllers/alunoController.js");
const withAuth = require('../controllers/middleware/middlewareAuth.js');

router.get("/aluno", alunoController.obterTodosAlunos);
router.post("/aluno", withAuth, alunoController.criarAluno);
router.get("/aluno/:id",withAuth,  alunoController.obterAluno);
router.delete("/aluno/:id", withAuth, alunoController.deletarAluno);
router.put("/aluno/:id", withAuth, alunoController.editarAluno);

module.exports = router;