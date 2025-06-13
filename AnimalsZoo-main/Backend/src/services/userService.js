const pool = require('../config/database');

const findUserByEmail = async (email) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = 'SELECT * FROM usuarios WHERE email = ?';
        const [rows] = await connection.execute(sql, [email]);
        return rows[0];
    } catch (error) {
        console.error('Erro no serviço ao buscar usuário por email:', error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

const createUser = async (userData) => {
    const { nome_completo, email, telefone, senha } = userData;
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = 'INSERT INTO usuarios (nome_completo, email, telefone, senha) VALUES (?, ?, ?, ?)';
        const [result] = await connection.execute(sql, [
            nome_completo,
            email,
            telefone || null,
            senha
        ]);
        return { id: result.insertId, ...userData };
    } catch (error) {
        console.error('Erro no serviço ao criar usuário:', error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

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
    findUserByEmail,
    createUser,
};
