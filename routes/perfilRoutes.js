const express = require("express");
const router = express.Router();
const perfilController = require("../controllers/perfilController.js");
const withAuth = require('../controllers/middleware/middlewareAuth.js');

router.get("/perfil", withAuth, perfilController.obterTodosPerfis);
router.post("/perfil", withAuth, perfilController.criarPerfil);
router.get("/perfil/:id", withAuth, perfilController.obterPerfil);
router.delete("/perfil/:id", withAuth, perfilController.deletarPerfil);
router.put("/perfil/:id",withAuth, perfilController.editarPerfil);

module.exports = router;