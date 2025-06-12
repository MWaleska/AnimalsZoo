const pool = require('../config/database');

// Buscar um usuário pelo ID (sem a senha)
const getUserById = async (userId) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT id, nome_completo, email, telefone, created_at, updated_at FROM usuarios WHERE id = ?',
            [userId]
        );
        return rows[0];
    } catch (error) {
        console.error('Erro no serviço ao buscar usuário por ID:', error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

// Atualizar dados de um usuário pelo ID
const updateUserById = async (userId, userDataToUpdate) => {
    let connection;

    const camposParaAtualizar = Object.keys(userDataToUpdate);

    if (camposParaAtualizar.length === 0) {
        return getUserById(userId);
    }

    const setClauses = camposParaAtualizar.map(key => `${key} = ?`).join(', ');
    const values = [...camposParaAtualizar.map(key => userDataToUpdate[key]), userId];

    try {
        connection = await pool.getConnection();
        const sql = `UPDATE usuarios SET ${setClauses}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        const [result] = await connection.execute(sql, values);

        if (result.affectedRows === 0) {
            return null;
        }

        return getUserById(userId);

    } catch (error) {
        console.error('Erro no serviço ao atualizar usuário:', error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    updateUserById,
    getUserById,
};