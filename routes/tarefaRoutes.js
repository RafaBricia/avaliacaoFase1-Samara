const express = require("express");
const router = express.Router();
const tarefaController = require("../controllers/tarefaController.js");
const withAuth = require('../controllers/middleware/middlewareAuth.js');

router.get("/tarefa", tarefaController.obterTodasTarefas);
router.post("/tarefa", withAuth, tarefaController.criarTarefa);
router.get("/tarefa/:id", tarefaController.obterTarefa);
router.delete("/tarefa/:id", withAuth, tarefaController.deletarTarefa);
router.put("/tarefa/:id", withAuth, tarefaController.editarTarefa);

module.exports = router;
