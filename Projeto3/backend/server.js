const express = require('express');
const cors = require('cors');
const compression = require('compression');
const apicache = require('apicache');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const winston = require('winston'); // Importa winston
const app = express();

app.use(cors());
app.use(compression());
app.use(express.json()); // Mover para aqui para garantir que JSON é parseado antes das rotas

const port = 3001;
const cache = apicache.middleware;
const SECRET_KEY = 'tamiuemura13';

// Configuração do winston para logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'might200231',
    database: 'projeto3'
});

pool.getConnection((err, connection) => {
    if (err) {
        logger.error('Erro ao conectar ao MySQL: ' + err.message);
        throw err;
    }
    logger.info('Conectado ao MySQL como id ' + connection.threadId);
    connection.release();
});

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        logger.warn('Token não fornecido');
        return res.status(401).json({ error: 'Acesso negado' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            logger.warn('Token inválido');
            return res.status(403).json({ error: 'Token inválido' });
        }

        req.user = user;
        next();
    });
}

//GET
app.get('/', (req, res) => {
    res.send('Servidor Express está funcionando!');
});

app.get('/emails', cache('5 minutes'), authenticateToken, (req, res) => {
    const query = 'SELECT * FROM emails WHERE usuario_id = ?';
    pool.query(query, [req.user.id], (err, results) => {
        if (err) {
            logger.error('Erro ao buscar emails: ' + err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

//POST
app.post('/emails', authenticateToken, (req, res) => {
    const { email, status_verificacao } = req.body;
    const query = 'INSERT INTO emails (email, status_verificacao, usuario_id) VALUES (?, ?, ?)';
    pool.query(query, [email, status_verificacao, req.user.id], (err, results) => {
        if (err) {
            logger.error('Erro ao inserir email: ' + err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Email inserido com sucesso!', id: results.insertId });
    });
});

app.post('/login', (req, res) => {
    const { username, senha } = req.body;

    const query = 'SELECT * FROM usuarios WHERE username = ?';
    pool.query(query, [username], (err, results) => {
        if (err) {
            logger.error('Erro ao buscar usuário: ' + err.message);
            res.status(500).json({ error: err.message });
            return;
        }

        if (results.length === 0) {
            logger.warn('Usuário não encontrado: ' + username);
            res.status(401).json({ error: 'Usuário não encontrado' });
            return;
        }

        const usuario = results[0];

        bcrypt.compare(senha, usuario.senha, (err, isMatch) => {
            if (err) {
                logger.error('Erro na comparação de senhas: ' + err.message);
                res.status(500).json({ error: err.message });
                return;
            }

            if (!isMatch) {
                logger.warn('Senha incorreta para usuário: ' + username);
                res.status(401).json({ error: 'Senha incorreta' });
                return;
            }

            const token = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ message: 'Login bem-sucedido', token });
        });
    });
});

app.listen(port, () => {
    logger.info(`Servidor rodando em http://localhost:${port}`);
});
