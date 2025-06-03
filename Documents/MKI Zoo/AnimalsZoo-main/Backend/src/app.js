const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.get('/api', (req, res) => {
    res.json({ message: 'API do AnimalsZoo (Petshop) funcionando!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/contato', contactRoutes);

module.exports = app;