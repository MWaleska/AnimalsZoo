const agendamentoService = require('../services/agendamentoService');

const criarAgendamento = async (req, res, next) => {
    try {
        const dadosAgendamento = { ...req.body, tutor_id: req.user.userId };

        // Validação básica dos campos obrigatórios
        if (!dadosAgendamento.pet_id || !dadosAgendamento.servico || !dadosAgendamento.data_agendamento || !dadosAgendamento.hora_agendamento) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios: pet, serviço, data e hora.' });
        }

        const novoAgendamento = await agendamentoService.createAgendamento(dadosAgendamento);
        res.status(201).json({ message: 'Agendamento criado com sucesso!', agendamento: novoAgendamento });

    } catch (error) {
        if (error.message.includes('agendamento_unico_pet_horario')) {
            return res.status(409).json({ message: 'Este pet já possui um agendamento neste mesmo dia e horário.' });
        }
        console.error('Erro no controller ao criar agendamento:', error);
        next(error);
    }
};

const listarAgendamentosPorTutor = async (req, res, next) => {
    try {
        const tutorId = req.user.userId;
        const agendamentos = await agendamentoService.getAgendamentosByTutorId(tutorId);
        res.status(200).json(agendamentos);
    } catch (error) {
        console.error('Erro no controller ao listar agendamentos:', error);
        next(error);
    }
};

const deletarAgendamento = async (req, res, next) => {
    try {
        const { id } = req.params;
        const tutorId = req.user.userId;

        const agendamento = await agendamentoService.getAgendamentoById(id);

        if (!agendamento) {
            return res.status(404).json({ message: 'Agendamento não encontrado.' });
        }

        if (agendamento.tutor_id !== tutorId) {
            return res.status(403).json({ message: 'Você não tem permissão para cancelar este agendamento.' });
        }

        await agendamentoService.deleteAgendamentoById(id);
        res.status(200).json({ message: 'Agendamento cancelado com sucesso.' });

    } catch (error) {
        console.error('Erro no controller ao deletar agendamento:', error);
        next(error);
    }
};

module.exports = {
    criarAgendamento,
    listarAgendamentosPorTutor,
    deletarAgendamento,
};