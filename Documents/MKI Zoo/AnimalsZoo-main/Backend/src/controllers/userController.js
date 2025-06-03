const userService = require('../services/userService');
const pool = require('../config/database');

// Buscar perfil do usuário logado
const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(403).json({ message: 'ID do usuário não encontrado no token.' });
        }

        const usuario = await userService.getUserById(userId);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error('Erro no controller ao buscar perfil do usuário:', error);
        next(error);
    }
};

// Atualizar perfil do usuário logado
const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(403).json({ message: 'ID do usuário não encontrado no token.' });
        }

        const { nome_completo, email, telefone } = req.body;

        const dadosParaAtualizar = {};
        if (nome_completo !== undefined) dadosParaAtualizar.nome_completo = nome_completo;
        if (email !== undefined) dadosParaAtualizar.email = email;
        if (telefone !== undefined) dadosParaAtualizar.telefone = telefone;

        if (Object.keys(dadosParaAtualizar).length === 0) {
            return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
        }

        // Validação de email 
        if (dadosParaAtualizar.email) {
            if (!/^\S+@\S+\.\S+$/.test(dadosParaAtualizar.email)) {
                return res.status(400).json({ message: 'Formato de email inválido.' });
            }
            let connection;
            try {
                connection = await pool.getConnection();
                const [existingUsers] = await connection.execute(
                    'SELECT id FROM usuarios WHERE email = ? AND id != ?',
                    [dadosParaAtualizar.email, userId]
                );
                if (existingUsers.length > 0) {
                    return res.status(409).json({ message: 'Este email já está em uso por outra conta.' });
                }
            } finally {
                if (connection) connection.release();
            }
        }

        const usuarioAtualizado = await userService.updateUserById(userId, dadosParaAtualizar);

        if (!usuarioAtualizado) {
            return res.status(404).json({ message: 'Usuário não encontrado ou nenhuma alteração feita.' });
        }

        res.status(200).json({ message: 'Perfil atualizado com sucesso!', usuario: usuarioAtualizado });

    } catch (error) {
        console.error('Erro no controller ao atualizar perfil:', error);
        next(error);
    }
};

module.exports = {
    updateUserProfile,
    getUserProfile,
};