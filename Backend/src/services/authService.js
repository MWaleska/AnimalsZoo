const userService = require('./userService');
const passwordUtils = require('../utils/passwordUtils');
const jwt = require('jsonwebtoken');

const login = async (credentials) => {
    const user = await userService.findUserByEmail(credentials.email);
    if (!user) {
        return null;
    }

    const isPasswordMatch = await passwordUtils.comparePassword(credentials.senha, user.senha);
    if (!isPasswordMatch) {
        return null;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    return { token, user: { id: user.id, nome: user.nome, email: user.email, telefone: user.telefone } };
};

module.exports = {
    login,
};