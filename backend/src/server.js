const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db_config');

const app = express();
const porta = 3004;


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

// Listar todos os usuários
app.get('/usuarios', (req, res) => {
    const query = 'SELECT id, nome, email, pontuacao, ofensiva FROM usuarios';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar usuários.' });
        }

        res.json({ success: true, usuarios: results });
    });
});


// Obter usuário por ID
app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    const query = 'SELECT id, nome, email, pontuacao, ofensiva FROM usuarios WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar usuário.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }

        res.json({ success: true, usuario: results[0] });
    });
});


// Editar Usuário

app.put('/usuarios/editar/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    const query = 'UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?';
    db.query(query, [nome, email, senha, id], (err, result) => {
        if (err) {
            console.error('Erro ao editar usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao editar usuário.' });
        }
        res.json({ success: true, message: 'Usuário editado com sucesso!' });
    });
});

// Deletar Usuário

app.delete('/usuarios/deletar/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM usuarios WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao deletar usuário.' });
        }
        res.json({ success: true, message: 'Usuário deletado com sucesso!' });
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

// Rota para criar hábito
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

    const marcarQuery = `
        INSERT INTO progresso (usuario_id, habito_id, data, status)
        VALUES (?, ?, CURDATE(), 'completo')
        ON DUPLICATE KEY UPDATE status = 'completo'
    `;

    db.query(marcarQuery, [usuario_id, habito_id], (err) => {
        if (err) {
            console.error('Erro ao marcar progresso:', err);
            return res.status(500).json({ success: false, message: 'Erro ao marcar progresso.' });
        }

        // Atualizar pontuação
        const pontosQuery = 'UPDATE usuarios SET pontuacao = pontuacao + 10 WHERE id = ?';
        db.query(pontosQuery, [usuario_id]);

        // Atualizar ofensiva
        const ofensivaQuery = `
            UPDATE usuarios
            SET
                ofensiva = CASE
                    WHEN ultimo_habito = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN ofensiva + 1
                    WHEN ultimo_habito = CURDATE() THEN ofensiva
                    ELSE 1
                END,
                ultimo_habito = CURDATE()
            WHERE id = ?
        `;

        db.query(ofensivaQuery, [usuario_id], (err2) => {
            if (err2) {
                console.error('Erro ao atualizar ofensiva:', err2);
                return res.status(500).json({ success: false, message: 'Erro ao atualizar ofensiva.' });
            }

            res.json({ success: true, message: 'Hábito marcado como completo! 🎯' });
        });
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


app.get('/usuarios/:id/streak', (req, res) => {
    const userId = req.params.id;

    const query = `
        SELECT habito_id, data
        FROM progresso
        WHERE usuario_id = ?
        ORDER BY data DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro ao buscar ofensiva' });

        let streak = 0;
        let diaEsperado = new Date();
        
        for (let i = 0; i < results.length; i++) {
            const data = new Date(results[i].data);
            
            if (data.toDateString() === diaEsperado.toDateString()) {
                streak++;
                diaEsperado.setDate(diaEsperado.getDate() - 1);
            } else if (data < diaEsperado) {
                break; // quebrou a sequência
            }
        }

        res.json({ streak });
    });
});


