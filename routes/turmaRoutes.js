const express = require("express");
const router = express.Router();
const turmaController = require("../controllers/turmaController.js");
const withAuth = require('../controllers/middleware/middlewareAuth.js');

router.get("/turma", turmaController.obterTodasTurmas);
router.post("/turma", withAuth, turmaController.criarTurma);
router.get("/turma/:id", turmaController.obterTurma);
router.delete("/turma/:id",withAuth, turmaController.deletarTurma);
router.put("/turma/:id", withAuth, turmaController.editarTurma);

module.exports = router;