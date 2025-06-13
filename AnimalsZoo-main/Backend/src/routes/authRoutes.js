const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Rota para Cadastro (POST)
// Espera um corpo JSON com: nomeCompleto, email, telefone (opcional), senha
router.post('/register', authController.register);

// Rota para Login (POST)
// Espera um corpo JSON com: email, senha
router.post('/login', authController.login);

module.exports = router;