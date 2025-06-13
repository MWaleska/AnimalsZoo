# PetsBemEstar (MKIZoo)

![Logo do PetsBemEstar](https://raw.githubusercontent.com/mwaleska/animalszoo/main/Frontend/img/logo.png)

## 📝 Descrição

PetsBemEstar é uma plataforma full-stack projetada para conectar tutores de animais de estimação a uma variedade de serviços de qualidade, como banho e tosa, cuidados de saúde, hospedagem e mais. O projeto nasceu da paixão por tecnologia e pelo amor aos animais, com o objetivo de fortalecer o ecossistema pet local, oferecendo visibilidade para petshops e confiança para os tutores.

## ✨ Funcionalidades Principais

* **Autenticação de Usuários**: Sistema seguro de cadastro e login para tutores.
* **Gerenciamento de Pets**: Funcionalidade CRUD (Criar, Ler, Atualizar, Deletar) para os animais de estimação dos usuários.
* **Dashboard do Usuário**: Uma área logada onde o tutor pode ver seus pets, agendamentos e informações de perfil.
* **Listagem de Serviços**: Página com os serviços oferecidos, incluindo detalhes como preço, duração e avaliações.
* **Formulário de Contato**: Um canal direto para que os usuários possam enviar mensagens e tirar dúvidas.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

* **Front-end**:
    * HTML5
    * CSS3 (com design responsivo)
    * JavaScript (Vanilla JS para manipulação do DOM e chamadas de API)
* **Back-end**:
    * Node.js
    * Express.js
    * `jsonwebtoken` para autenticação com Tokens JWT
    * `bcryptjs` para hashing de senhas
* **Banco de Dados**:
    * MySQL

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

* [Node.js](https://nodejs.org/) (versão 12 ou superior)
* Um servidor de banco de dados MySQL em execução.

### 1. Configuração do Banco de Dados

Para criar a estrutura de banco de dados e as tabelas necessárias, execute o script localizado em `Backend/database_setup.sql` em seu servidor MySQL.

### 2. Configuração do Back-end

1.  **Navegue até a pasta do back-end:**
    ```bash
    cd Backend
    ```

2.  **Crie o arquivo de variáveis de ambiente:**
    Crie um arquivo chamado `.env` na raiz da pasta `Backend` e preencha com suas credenciais do banco de dados e um segredo para o JWT. Use o exemplo abaixo:

    ```env
    # Configuração do Banco de Dados
    DB_HOST=localhost
    DB_USER=seu_usuario_mysql
    DB_PASS=sua_senha_mysql
    DB_NAME=MKIZoo

    # Segredo para o JWT
    JWT_SECRET=seu_segredo_super_secreto_aqui
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Inicie o servidor:**
    Ainda dentro da pasta `Backend/`, execute o seguinte comando para iniciar o servidor:
    ```bash
    node src/server.js
    ```
    O servidor back-end estará rodando em `http://localhost:3006`.

### 3. Configuração do Front-end

O front-end é composto por arquivos estáticos. Basta abrir o arquivo `index.html` em seu navegador.

1.  Navegue até a pasta `Frontend/pages`.
2.  Abra o arquivo `index.html` com um navegador de sua preferência.

> **Dica**: Para uma melhor experiência de desenvolvimento e para evitar problemas com CORS (apesar de estar habilitado no back-end), recomenda-se usar uma extensão como o "Live Server" no VS Code.

## 🔗 Estrutura de Endpoints da API

A URL base para a API é `http://localhost:3006/api`.

* `POST /api/auth/register` - Registra um novo usuário.
* `POST /api/auth/login` - Realiza o login e retorna um token JWT.
* `GET /api/usuarios/me` - Retorna o perfil do usuário logado (rota protegida).
* `PUT /api/usuarios/me` - Atualiza o perfil do usuário logado (rota protegida).
* `POST /api/pets` - Cadastra um novo pet.
* `GET /api/pets` - Lista todos os pets.
* `GET /api/pets/:id` - Retorna um pet específico.
* `PUT /api/pets/:id` - Atualiza um pet específico.
* `DELETE /api/pets/:id` - Deleta um pet específico.
* `POST /api/contato` - Envia uma mensagem pelo formulário de contato.