const pool = require('../config/database');

const getAgendamentoById = async (id) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = `SELECT a.*, p.nome as pet_nome FROM agendamentos a JOIN pets p ON a.pet_id = p.id WHERE a.id = ?`;
        const [rows] = await connection.execute(sql, [id]);
        return rows[0];
    } catch (error) {
        console.error('Erro no serviço ao buscar agendamento por ID:', error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

const createAgendamento = async (dados) => {
    const { pet_id, tutor_id, servico, data_agendamento, hora_agendamento, status } = dados;
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = `
            INSERT INTO agendamentos (pet_id, tutor_id, servico, data_agendamento, hora_agendamento, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await connection.execute(sql, [pet_id, tutor_id, servico, data_agendamento, hora_agendamento, status || 'Confirmado']);

        const novoAgendamento = await getAgendamentoById(result.insertId);
        return novoAgendamento;

    } catch (error) {
        console.error('Erro no serviço ao criar agendamento:', error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

const getAgendamentosByTutorId = async (tutorId) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = `
            SELECT a.*, p.nome as pet_nome
            FROM agendamentos a
            JOIN pets p ON a.pet_id = p.id
            WHERE a.tutor_id = ?
            ORDER BY a.data_agendamento ASC, a.hora_agendamento ASC
        `;
        const [rows] = await connection.execute(sql, [tutorId]);
        return rows;
    } catch (error) {
        console.error('Erro no serviço ao buscar agendamentos por tutor:', error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

const deleteAgendamentoById = async (id) => {
     let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute('DELETE FROM agendamentos WHERE id = ?', [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Erro no serviço ao deletar agendamento:', error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    createAgendamento,
    getAgendamentosByTutorId,
    getAgendamentoById,
    deleteAgendamentoById
};