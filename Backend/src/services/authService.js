const userService = require('./userService');
const passwordUtils = require('../utils/passwordUtils');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (userData) => {
    const { nomeCompleto, email, telefone, senha } = userData;
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
        const error = new Error('Este email já está cadastrado.');
        error.statusCode = 409;
        throw error;
    }
    const hashedPassword = await passwordUtils.hashPassword(senha);
    const newUser = await userService.createUser({
        nome_completo: nomeCompleto,
        email: email,
        telefone: telefone,
        senha: hashedPassword,
    });
    return { id: newUser.id, nomeCompleto: newUser.nome_completo, email: newUser.email };
};

const loginUser = async (loginData) => {
    const { email, senha } = loginData;
    const user = await userService.findUserByEmail(email);
    if (!user) {
        throw new Error('Credenciais inválidas.');
    }
    const isPasswordMatch = await passwordUtils.comparePassword(senha, user.senha);
    if (!isPasswordMatch) {
        throw new Error('Credenciais inválidas.');
    }
    const tokenPayload = { userId: user.id, email: user.email };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });
    return {
        token,
        user: {
            id: user.id,
            nomeCompleto: user.nome_completo,
            email: user.email,
        },
    };
};

module.exports = {
    registerUser,
    loginUser,
};
