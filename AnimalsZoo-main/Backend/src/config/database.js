const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('Conectado ao banco de dados MySQL com sucesso!');
        connection.release();
    })
    .catch(err => {
        console.error('Erro ao conectar com o banco de dados MySQL:', err.message);
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.error(`O banco de dados '${process.env.DB_NAME}' não foi encontrado. Verifique se ele existe.`);
        } else if (err.code === 'ECONNREFUSED') {
            console.error('A conexão com o servidor MySQL foi recusada. Verifique se o servidor MySQL está rodando.');
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Acesso negado para o usuário do banco de dados. Verifique as credenciais (usuário/senha).');
        }
    });

module.exports = pool;