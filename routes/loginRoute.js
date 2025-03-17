const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController.js');

router.post('/loginAluno', loginController.loginAluno);
router.post('/loginProfessor', loginController.loginProf);

module.exports = router;