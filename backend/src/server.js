const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db_config');

const app = express();
const porta = 3000;


app.use(cors());
app.use(bodyParser.json());


app.listen(porta, () => console.log(`Servidor rodando na porta ${porta}`));


// Cadastro de usuário
app.post('/register', (req, res) => {
    const { nome, email, senha } = req.body;

    const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    db.query(query, [nome, email, senha], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar.' });
        }
        res.status(201).json({ success: true, message: 'Usuário cadastrado com sucesso!' });
    });
});

// Login de usuário
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    db.query(query, [email, senha], (err, results) => {
        if (err) {
            console.error('Erro no login:', err);
            return res.status(500).json({ success: false, message: 'Erro no login.' });
        }

        if (results.length > 0) {
            res.json({ success: true, message: 'Login bem-sucedido!', user: results[0] });
        } else {
            res.status(401).json({ success: false, message: 'Email ou senha incorretos.' });
        }
    });
});



app.post('/habitos/criar', (req, res) => {
    const { usuario_id, titulo, descricao } = req.body;

    const query = 'INSERT INTO habitos (usuario_id, titulo, descricao) VALUES (?, ?, ?)';
    db.query(query, [usuario_id, titulo, descricao], (err, result) => {
        if (err) {
            console.error('Erro ao criar hábito:', err);
            return res.status(500).json({ success: false, message: 'Erro ao criar hábito.' });
        }
        res.status(201).json({ success: true, message: 'Hábito criado com sucesso!' });
    });
});


app.get('/habitos/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;

    const query = `
        SELECT h.id, h.titulo, h.descricao, p.status, p.data
        FROM habitos h
        LEFT JOIN progresso p ON h.id = p.habito_id AND p.data = CURDATE()
        WHERE h.usuario_id = ?`;

    db.query(query, [usuario_id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar hábitos:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar hábitos.' });
        }
        res.json({ success: true, habitos: results });
    });
});

app.post('/progresso/marcar', (req, res) => {
    const { usuario_id, habito_id } = req.body;

    const query = `
        INSERT INTO progresso (usuario_id, habito_id, data, status)
        VALUES (?, ?, CURDATE(), 'completo')
        ON DUPLICATE KEY UPDATE status = 'completo'
    `;

    db.query(query, [usuario_id, habito_id], (err, results) => {
        if (err) {
            console.error('Erro ao marcar progresso:', err);
            return res.status(500).json({ success: false, message: 'Erro ao marcar progresso.' });
        }

        // Atualiza pontuação do usuário
        const pontosQuery = 'UPDATE usuarios SET pontuacao = pontuacao + 10 WHERE id = ?';
        db.query(pontosQuery, [usuario_id]);

        res.json({ success: true, message: 'Hábito marcado como completo! 🎯' });
    });
});


app.get('/ranking', (req, res) => {
    const query = `
        SELECT nome, pontuacao
        FROM usuarios
        ORDER BY pontuacao DESC
        LIMIT 10
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar ranking:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar ranking.' });
        }
        res.json({ success: true, ranking: results });
    });
});

app.get('/progresso/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;

    const query = `
        SELECT
            (SELECT COUNT(*) FROM habitos WHERE usuario_id = ?) AS total,
            (SELECT COUNT(*) FROM progresso WHERE usuario_id = ? AND data = CURDATE() AND status = 'completo') AS completos
    `;

    db.query(query, [usuario_id, usuario_id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar progresso:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar progresso.' });
        }
        res.json({ success: true, progresso: results[0] });
    });
});


app.put('/habitos/editar/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, descricao } = req.body;

    const query = 'UPDATE habitos SET titulo = ?, descricao = ? WHERE id = ?';
    db.query(query, [titulo, descricao, id], (err, result) => {
        if (err) {
            console.error('Erro ao editar hábito:', err);
            return res.status(500).json({ success: false, message: 'Erro ao editar hábito.' });
        }
        res.json({ success: true, message: 'Hábito editado com sucesso!' });
    });
});

app.delete('/habitos/deletar/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM habitos WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar hábito:', err);
            return res.status(500).json({ success: false, message: 'Erro ao deletar hábito.' });
        }
        res.json({ success: true, message: 'Hábito deletado com sucesso!' });
    });
});



