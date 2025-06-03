require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Endpoints de autenticação disponíveis em http://localhost:${PORT}/api/auth`);
});