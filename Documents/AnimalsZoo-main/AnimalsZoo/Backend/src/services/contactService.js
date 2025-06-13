const pool = require('../config/database');

const processContactMessage = async (messageData) => {
    const { nomeCompleto, email, telefone, mensagem } = messageData;
    let connection;

    console.log('Nova mensagem de contato recebida para processamento:');
    console.log('Nome:', nomeCompleto);
    console.log('Email:', email);
    console.log('Telefone:', telefone || '(Não informado)');
    console.log('Mensagem:', mensagem);

    try {
        connection = await pool.getConnection();
        const sql = 'INSERT INTO mensagens_contato (nome_completo, email, telefone, mensagem) VALUES (?, ?, ?, ?)';
        await connection.execute(sql, [
            nomeCompleto,
            email,
            telefone || null,
            mensagem
        ]);
        console.log('Mensagem de contato salva no banco de dados.');
        return { success: true, message: 'Mensagem salva e processada.' };

    } catch (dbError) {
        console.error('Erro ao salvar mensagem de contato no banco ou enviar email:', dbError);
        throw new Error('Ocorreu um erro ao processar sua mensagem. Tente novamente mais tarde.');
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

module.exports = {
    processContactMessage,
};
