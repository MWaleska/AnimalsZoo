const contactService = require('../services/contactService');

const handleContactSubmission = async (req, res, next) => {
    try {
        const { nomeCompleto, email, telefone, mensagem } = req.body;

        if (!nomeCompleto || !email || !mensagem) {
            return res.status(400).json({ message: 'Nome completo, email e mensagem são obrigatórios.' });
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: 'Formato de email inválido.' });
        }

        await contactService.processContactMessage({ nomeCompleto, email, telefone, mensagem });

        res.status(200).json({ message: 'Mensagem recebida com sucesso! Entraremos em contato em breve.' });

    } catch (error) {
        console.error('Erro no controller de contato:', error);
        res.status(500).json({ message: 'Ocorreu um erro ao processar sua mensagem.' });
    }
};

module.exports = {
    handleContactSubmission,
};
