const express = require('express');
const agendamentoController = require('../controllers/agendamentoController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.post('/', agendamentoController.criarAgendamento);
router.get('/', agendamentoController.listarAgendamentosPorTutor);
router.delete('/:id', agendamentoController.deletarAgendamento);

module.exports = router;
