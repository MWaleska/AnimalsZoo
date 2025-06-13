const petService = require('../services/petService');

// Cadastrar um novo pet
const cadastrarPet = async (req, res, next) => {
    try {
        const { nome, sexo, idade, tutor_id } = req.body;

        if (!nome || !sexo || idade === undefined || idade === null) {
            return res.status(400).json({ message: 'Nome, sexo e idade são obrigatórios.' });
        }
        if (typeof idade !== 'number' || !Number.isInteger(idade) || idade < 0) {
            return res.status(400).json({ message: 'Idade deve ser um número inteiro não negativo.' });
        }
        if (tutor_id !== undefined && tutor_id !== null && (typeof tutor_id !== 'number' || !Number.isInteger(tutor_id))) {
            return res.status(400).json({ message: 'ID do tutor deve ser um número inteiro ou nulo.' });
        }

        const novoPet = await petService.createPet(req.body);
        res.status(201).json({ message: 'Pet cadastrado com sucesso!', pet: novoPet });
    } catch (error) {
        console.error('Erro no controller ao cadastrar pet:', error);
        if (error.code === 'ER_NO_REFERENCED_ROW_2' || (error.message && error.message.toLowerCase().includes('foreign key constraint fails'))) {
            return res.status(400).json({ message: 'ID do tutor fornecido não existe ou é inválido.' });
        }
        next(error);
    }
};

// Listar todos os pets
const listarPets = async (req, res, next) => {
    try {
        const pets = await petService.getAllPets();
        res.status(200).json(pets);
    } catch (error) {
        console.error('Erro no controller ao listar pets:', error);
        next(error);
    }
};

// Obter um pet específico pelo ID
const obterPetPorId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const pet = await petService.getPetById(id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado.' });
        }
        res.status(200).json(pet);
    } catch (error) {
        console.error('Erro no controller ao obter pet por ID:', error);
        next(error);
    }
};

// Atualizar um pet existente
const atualizarPet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;

        if (dadosAtualizados.idade !== undefined && (typeof dadosAtualizados.idade !== 'number' || !Number.isInteger(dadosAtualizados.idade) || dadosAtualizados.idade < 0)) {
            return res.status(400).json({ message: 'Idade deve ser um número inteiro não negativo.' });
        }
        if (dadosAtualizados.tutor_id !== undefined && dadosAtualizados.tutor_id !== null && (typeof dadosAtualizados.tutor_id !== 'number' || !Number.isInteger(dadosAtualizados.tutor_id))) {
            return res.status(400).json({ message: 'ID do tutor deve ser um número inteiro ou nulo.' });
        }

        const petAtualizado = await petService.updatePetById(id, dadosAtualizados);
        if (!petAtualizado) {
            return res.status(404).json({ message: 'Pet não encontrado para atualização.' });
        }
        res.status(200).json({ message: 'Pet atualizado com sucesso!', pet: petAtualizado });
    } catch (error) {
        console.error('Erro no controller ao atualizar pet:', error);
         if (error.code === 'ER_NO_REFERENCED_ROW_2' || (error.message && error.message.toLowerCase().includes('foreign key constraint fails'))) {
            return res.status(400).json({ message: 'ID do tutor fornecido para atualização não existe ou é inválido.' });
        }
        next(error);
    }
};

// Remover um pet
const removerPet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const petRemovido = await petService.deletePetById(id);
        if (!petRemovido) {
            return res.status(404).json({ message: 'Pet não encontrado para remoção.' });
        }
        res.status(200).json({ message: 'Pet removido com sucesso.' });
    } catch (error) {
        console.error('Erro no controller ao remover pet:', error);
        next(error);
    }
};

module.exports = {
    cadastrarPet,
    listarPets,
    obterPetPorId,
    atualizarPet,
    removerPet,
};