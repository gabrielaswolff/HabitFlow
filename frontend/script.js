const apiUrl = 'http://localhost:3000';

// Função para exibir notificações
function mostrarNotificacao(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.classList.add('notificacao');
    notificacao.innerText = mensagem;

    document.getElementById('notificacaoContainer').appendChild(notificacao);

    setTimeout(() => {
        notificacao.remove();
    }, 4000);
}

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
        mostrarNotificacao(data.message);
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
            mostrarNotificacao('Bem-vindo(a), ' + data.user.nome);
            localStorage.setItem('userId', data.user.id);
        } else {
            mostrarNotificacao(data.message);
        }
    } catch (error) {
        console.error('Erro no login:', error);
    }
});

// Adicionar Hábito
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
        mostrarNotificacao(data.message);
        carregarHabitos();
    } catch (error) {
        console.error('Erro ao criar hábito:', error);
    }
});

// Carregar Hábitos
async function carregarHabitos() {
    const usuario_id = localStorage.getItem('userId');
    const painel = document.getElementById('painelHabitos');
    painel.innerHTML = '';

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

// Marcar Hábito como Completo
async function marcarCompleto(habito_id) {
    const usuario_id = localStorage.getItem('userId');

    try {
        const response = await fetch(`${apiUrl}/progresso/marcar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id, habito_id })
        });
        const data = await response.json();
        mostrarNotificacao(data.message);
        carregarHabitos();
    } catch (error) {
        console.error('Erro ao marcar hábito:', error);
    }
}

// Editar Hábito
async function editarHabito(id, titulo, descricao) {
    const novoTitulo = prompt('Novo título:', titulo);
    const novaDescricao = prompt('Nova descrição:', descricao);

    if (novoTitulo && novaDescricao) {
        try {
            const response = await fetch(`${apiUrl}/habitos/editar/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo: novoTitulo, descricao: novaDescricao })
            });
            const data = await response.json();
            mostrarNotificacao(data.message);
            carregarHabitos();
        } catch (error) {
            console.error('Erro ao editar hábito:', error);
        }
    }
}

// Deletar Hábito
async function deletarHabito(id) {
    if (confirm('Tem certeza de que deseja excluir este hábito?')) {
        try {
            const response = await fetch(`${apiUrl}/habitos/deletar/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            mostrarNotificacao(data.message);
            carregarHabitos();
        } catch (error) {
            console.error('Erro ao excluir hábito:', error);
        }
    }
}

// Carregar Ranking
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

carregarRanking();

// Array com mensagens motivacionais
const mensagens = [
    "Você consegue! Não desista agora.",
    "O sucesso é a soma de pequenos esforços repetidos.",
    "Cada dia é uma nova chance para mudar sua vida.",
    "Acredite em si mesmo e tudo será possível.",
    "Você é mais forte do que pensa!",
    "Mantenha o foco e siga em frente!",
    "Nada é impossível. Acredite em você!",
    "O único limite para o seu sucesso é você mesmo!"
];

// Função para exibir uma mensagem aleatória
// Função para exibir uma mensagem motivacional com animação
function exibirMensagemMotivacional() {
    const mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
    const mensagemElement = document.getElementById('textoMensagem');
    const painelMensagem = document.getElementById('mensagemMotivacional');
    
    // Atualize o texto da mensagem
    mensagemElement.textContent = mensagem;

    // Exibir a mensagem
    painelMensagem.style.display = 'block'; // Mostra o painel diretamente
    
    // Adicionar a classe 'show' para a animação de opacidade
    painelMensagem.classList.add('show');

    // Esconde a mensagem após 3 segundos
    setTimeout(() => {
        painelMensagem.classList.remove('show');
        painelMensagem.style.display = 'none'; // Esconde o painel
    }, 3000); // Tempo de exibição da mensagem (3 segundos)
}

// Exibir uma mensagem a cada 10 segundos
setInterval(exibirMensagemMotivacional, 10000); // 10.000 milissegundos = 10 segundos

