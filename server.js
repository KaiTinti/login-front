const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const dbConfig = {
    user: 'root',       // Usuário do banco de dados
    password: 'sua_senha',     // Senha do banco de dados
    server: 'localhost',       // Nome do servidor (ou IP)
    database: 'login_db',      // Nome do banco de dados
    options: {
        encrypt: true,         // Se for necessário SSL, ajuste isso
        trustServerCertificate: true // Aceita certificado auto-assinado no SQL Server
    }
};


sql.connect(dbConfig, (err) => {
    if (err) {
        console.log('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados SQL Server');
});

// Endpoint para login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Consulta SQL para obter o usuário com base no nome de usuário
        const query = 'SELECT * FROM users WHERE username = @username';
        
        // Criar um request para execução da query
        const request = new sql.Request();
        request.input('username', sql.VarChar, username); // Passa o parâmetro username

        const result = await request.query(query);

        // Verificar se o usuário foi encontrado
        if (result.recordset.length === 0) {
            return res.status(400).send('Usuário não encontrado');
        }

        const user = result.recordset[0];

        // Verificar a senha
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).send('Senha incorreta');
        }

        res.status(200).send('Login bem-sucedido!');
    } catch (err) {
        console.error('Erro ao consultar o banco de dados:', err);
        res.status(500).send('Erro interno do servidor');
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
