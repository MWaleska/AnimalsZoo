const pool = require('../config/database');

// Criar um novo pet
const createPet = async (petData) => {
    const { nome, especie, raca, sexo, idade, peso_kg, observacoes, tutor_id } = petData;
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = `INSERT INTO pets (nome, especie, raca, sexo, idade, peso_kg, observacoes, tutor_id)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await connection.execute(sql, [
            nome,
            especie || null,
            raca || null,
            sexo,
            idade,
            peso_kg || null,
            observacoes || null,
            tutor_id || null
        ]);
        return { id: result.insertId, ...petData };
    } catch (error) {
        console.error('Erro no serviço ao criar pet:', error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

// Buscar todos os pets
const getAllPets = async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = `
            SELECT p.*, u.nome_completo as nome_tutor 
            FROM pets p 
            LEFT JOIN usuarios u ON p.tutor_id = u.id 
            ORDER BY p.nome ASC
        `;
        const [rows] = await connection.execute(sql);
        return rows;
    } catch (error) {
        console.error('Erro no serviço ao buscar todos os pets:', error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

// Buscar um pet pelo ID
const getPetById = async (id) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = `
            SELECT p.*, u.nome_completo as nome_tutor 
            FROM pets p 
            LEFT JOIN usuarios u ON p.tutor_id = u.id 
            WHERE p.id = ?
        `;
        const [rows] = await connection.execute(sql, [id]);
        return rows[0];
    } catch (error) {
        console.error('Erro no serviço ao buscar pet por ID:', error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

// Atualizar um pet pelo ID
const updatePetById = async (id, petData) => {
    const { nome, especie, raca, sexo, idade, peso_kg, observacoes, tutor_id } = petData;
    let connection;

    const updates = {};
    if (nome !== undefined) updates.nome = nome;
    if (especie !== undefined) updates.especie = especie;
    if (raca !== undefined) updates.raca = raca;
    if (sexo !== undefined) updates.sexo = sexo;
    if (idade !== undefined) updates.idade = idade;
    if (peso_kg !== undefined) updates.peso_kg = peso_kg;
    if (observacoes !== undefined) updates.observacoes = observacoes;
    if (tutor_id !== undefined) updates.tutor_id = (tutor_id === '' || tutor_id === null) ? null : tutor_id;


    if (Object.keys(updates).length === 0) {
        return getPetById(id);
    }

    const setClauses = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    try {
        connection = await pool.getConnection();
        const sql = `UPDATE pets SET ${setClauses}, data_atualizacao = CURRENT_TIMESTAMP WHERE id = ?`;
        const [result] = await connection.execute(sql, values);

        if (result.affectedRows === 0) {
            return null;
        }
        return getPetById(id);
    } catch (error) {
        console.error('Erro no serviço ao atualizar pet:', error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

// Deletar um pet pelo ID
const deletePetById = async (id) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.execute('DELETE FROM pets WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('Erro no serviço ao deletar pet:', error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};
module.exports = {
    createPet,
    getAllPets,
    getPetById,
    updatePetById,
    deletePetById,
};