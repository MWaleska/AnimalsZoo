const authService = require('../services/authService');

const register = async (req, res, next) => {
    try {
        const { nomeCompleto, email, telefone, senha } = req.body;

        if (!nomeCompleto || !email || !senha) {
            return res.status(400).json({ message: 'Nome completo, email e senha são obrigatórios.' });
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: 'Formato de email inválido.' });
        }

        const result = await authService.registerUser({ nomeCompleto, email, telefone, senha });

        res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: result.userId });

    } catch (error) {
        if (error.message === 'Este email já está cadastrado.') {
            return res.status(409).json({ message: error.message });
        }
        console.error('Erro no controller de registro:', error);
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        const result = await authService.loginUser({ email, senha });

        res.status(200).json({
            message: 'Login bem-sucedido!',
            token: result.token,
            user: {
                id: result.user.id,
                nomeCompleto: result.user.nomeCompleto,
                email: result.user.email
            }
        });

    } catch (error) {
        if (error.message === 'Credenciais inválidas.') {
            return res.status(401).json({ message: error.message });
        }
        console.error('Erro no controller de login:', error);
        next(error);
    }
};

module.exports = {
    register,
    login,
};