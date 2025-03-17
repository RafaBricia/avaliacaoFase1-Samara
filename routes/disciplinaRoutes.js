const express = require("express");
const router = express.Router();
const disciplinaController = require("../controllers/disciplinaController.js");
const withAuth = require('../controllers/middleware/middlewareAuth.js');

router.get("/disciplina", disciplinaController.obterTodasDisciplinas);
router.post("/disciplina", withAuth, disciplinaController.criarDisciplina);
router.get("/disciplina/:id", disciplinaController.obterDisiciplina);
router.delete("/disciplina/:id",withAuth, disciplinaController.deletarDisciplina);
router.put("/disciplina/:id", withAuth, disciplinaController.editarDisciplina);

module.exports = router;