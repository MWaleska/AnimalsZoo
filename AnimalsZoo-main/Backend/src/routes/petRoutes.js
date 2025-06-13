const express = require('express');
const petController = require('../controllers/petController');

const router = express.Router();

// Rota para cadastrar um novo pet
router.post('/', petController.cadastrarPet);

// Rota para listar todos os pets
router.get('/', petController.listarPets);

// Rota para obter um pet específico pelo ID
router.get('/:id', petController.obterPetPorId);

// Rota para atualizar um pet existente pelo ID
router.put('/:id', petController.atualizarPet);

// Rota para remover um pet pelo ID
router.delete('/:id', petController.removerPet);

module.exports = router;