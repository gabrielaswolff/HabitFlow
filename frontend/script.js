const apiUrl = 'http://localhost:3000';

// Cadastro
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('emailCadastro').value;
    const senha = document.getElementById('senhaCadastro').value;

    try {
        const response = await fetch(`${apiUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });
        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
    }
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('emailLogin').value;
    const senha = document.getElementById('senhaLogin').value;

    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        const data = await response.json();
        if (data.success) {
            alert('Bem-vindo(a), ' + data.user.nome);
            localStorage.setItem('userId', data.user.id);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Erro no login:', error);
    }
});


document.getElementById('habitForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario_id = localStorage.getItem('userId');
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;

    try {
        const response = await fetch(`${apiUrl}/habitos/criar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id, titulo, descricao })
        });
        const data = await response.json();
        alert(data.message);
        carregarHabitos();
    } catch (error) {
        console.error('Erro ao criar hábito:', error);
    }
});


// testes

async function carregarHabitos() {
    const usuario_id = localStorage.getItem('userId');
    const painel = document.getElementById('painelHabitos');
    painel.innerHTML = ''; // Limpa o painel

    try {
        const response = await fetch(`${apiUrl}/habitos/${usuario_id}`);
        const data = await response.json();

        if (data.success) {
           
data.habitos.forEach(habito => {
    const div = document.createElement('div');
    div.innerHTML = `
        <h3>${habito.titulo}</h3>
        <p>${habito.descricao || 'Sem descrição.'}</p>
        <p>Status: ${habito.status === 'completo' ? '✅ Completo' : '🔴 Pendente'}</p>
        ${habito.status !== 'completo' ? `<button onclick="marcarCompleto(${habito.id})">Marcar como completo</button>` : ''}
        <button onclick="editarHabito(${habito.id}, '${habito.titulo}', '${habito.descricao || ''}')">Editar</button>
        <button onclick="deletarHabito(${habito.id})">Excluir</button>
        <hr>
    `;
    painel.appendChild(div);
});

        }
    } catch (error) {
        console.error('Erro ao carregar hábitos:', error);
    }
}

async function marcarCompleto(habito_id) {
    const usuario_id = localStorage.getItem('userId');

    try {
        const response = await fetch(`${apiUrl}/progresso/marcar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id, habito_id })
        });
        const data = await response.json();
        alert(data.message);
        carregarHabitos(); // Atualiza o painel
    } catch (error) {
        console.error('Erro ao marcar hábito:', error);
    }
}


carregarHabitos();


async function carregarRanking() {
    try {
        const resposta = await fetch('http://localhost:3000/ranking');
        const dados = await resposta.json();

        if (dados.success) {
            const rankingDiv = document.getElementById('ranking');
            rankingDiv.innerHTML = '';

            dados.ranking.forEach((usuario, index) => {
                const item = document.createElement('div');
                item.innerHTML = `<strong>${index + 1}º</strong> - ${usuario.nome} (${usuario.pontuacao} pontos)`;
                
                // destaque para o 1º lugar
                if (index === 0) {
                    item.style.color = 'gold';
                    item.style.fontWeight = 'bold';
                    item.innerHTML = `🥇 ${usuario.nome} (${usuario.pontuacao} pontos)`;
                } else if (index === 1) {
                    item.innerHTML = `🥈 ${usuario.nome} (${usuario.pontuacao} pontos)`;
                } else if (index === 2) {
                    item.innerHTML = `🥉 ${usuario.nome} (${usuario.pontuacao} pontos)`;
                }
                
                rankingDiv.appendChild(item);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar ranking:', error);
    }
}

carregarRanking()


async function editarHabito(id, tituloAtual, descricaoAtual) {
    const novoTitulo = prompt('Novo título:', tituloAtual);
    const novaDescricao = prompt('Nova descrição:', descricaoAtual);

    if (novoTitulo !== null && novaDescricao !== null) {
        try {
            const response = await fetch(`${apiUrl}/habitos/editar/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo: novoTitulo, descricao: novaDescricao })
            });
            const data = await response.json();
            alert(data.message);
            carregarHabitos();
        } catch (error) {
            console.error('Erro ao editar hábito:', error);
        }
    }
}

async function deletarHabito(id) {
    if (confirm('Tem certeza que deseja excluir este hábito?')) {
        try {
            const response = await fetch(`${apiUrl}/habitos/deletar/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            alert(data.message);
            carregarHabitos();
        } catch (error) {
            console.error('Erro ao deletar hábito:', error);
        }
    }
}


function mostrarMensagemMotivacional() {
    const mensagens = [
        "Você é capaz de alcançar grandes coisas! 🚀",
        "Cada pequeno passo te aproxima do seu objetivo! 🏆",
        "Persistência é a chave do sucesso! 🔑",
        "Um novo hábito hoje, uma nova vida amanhã! 🌟",
        "Você está construindo o seu futuro agora! 💪"
    ];

    const index = Math.floor(Math.random() * mensagens.length);
    alert(mensagens[index]);
}

// Quando carregar os hábitos:
carregarHabitos();
mostrarMensagemMotivacional();




