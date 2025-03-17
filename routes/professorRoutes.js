const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController.js");
const withAuth = require('../controllers/middleware/middlewareAuth.js');

router.get("/professor", withAuth, professorController.obterTodosProfessores);
router.post("/professor", withAuth, professorController.criarProfessor);
router.get("/professor/:id", withAuth, professorController.obterProfessor);
router.delete("/professor/:id", withAuth, professorController.deletarProfessor);
router.put("/professor/:id", withAuth, professorController.editarProfessor);

module.exports = router; 