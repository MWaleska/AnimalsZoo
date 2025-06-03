const pool = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const jwt = require('jsonwebtoken');
require('dotenv').config(); //

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET não está definido nas variáveis de ambiente.");
    process.exit(1);
}

const registerUser = async (userData) => {
    const { nomeCompleto, email, telefone, senha } = userData;
    let connection;

    try {
        connection = await pool.getConnection();

        // 1. Verificar se o email já existe
        const [existingUsuarios] = await connection.execute('SELECT email FROM usuarios WHERE email = ?', [email]);
        if (existingUsuarios.length > 0) {
            throw new Error('Este email já está cadastrado.');
        }

        // 2. Hashear a senha
        const hashedPassword = await hashPassword(senha);

        // 3. Inserir o novo usuário no banco
        const sql = 'INSERT INTO usuarios (nome_completo, email, telefone, senha) VALUES (?, ?, ?, ?)';
        const [result] = await connection.execute(sql, [nomeCompleto, email, telefone, hashedPassword]);

        return { userId: result.insertId };

    } catch (error) {
        console.error('Erro no serviço de registro:', error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

const loginUser = async (loginData) => {
    const { email, senha } = loginData;
    let connection;

    try {
        connection = await pool.getConnection();

        // 1. Buscar usuário pelo email
        const [usuarios] = await connection.execute('SELECT id, nome_completo, email, senha FROM usuarios WHERE email = ?', [email]);
        if (usuarios.length === 0) {
            throw new Error('Credenciais inválidas.');
        }
        const usuario = usuarios[0];

        // 2. Comparar a senha fornecida com a senha hasheada no banco
        const isPasswordMatch = await comparePassword(senha, usuario.senha);
        if (!isPasswordMatch) {
            throw new Error('Credenciais inválidas.');
        }

        // 3. Gerar Token JWT
        const tokenPayload = {
            userId: usuario.id,
            email: usuario.email,
        };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

        return {
            token,
            user: {
                id: usuario.id,
                nomeCompleto: usuario.nome_completo,
                email: usuario.email,
            },
        };

    } catch (error) {
        console.error('Erro no serviço de login:', error.message);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    registerUser,
    loginUser,
};