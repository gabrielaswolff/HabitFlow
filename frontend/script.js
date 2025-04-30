const apiUrl = 'http://localhost:3004';

// notificações

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

// mensagens motivacionais

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

function exibirMensagemMotivacional() {
    const mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
    const mensagemElement = document.getElementById('textoMensagem');
    const painelMensagem = document.getElementById('mensagemMotivacional');

    mensagemElement.textContent = mensagem;

    painelMensagem.style.display = 'block'; 

    painelMensagem.classList.add('show');

    // esconder msgm

    setTimeout(() => {
        painelMensagem.classList.remove('show');
        painelMensagem.style.display = 'none'; 
    }, 3000); 
}

setInterval(exibirMensagemMotivacional, 10000); 


// ofensiva

const userId = localStorage.getItem('userId');
fetch(`${apiUrl}/usuarios/${userId}/streak`)
    .then(response => response.json())
    .then(data => {
        const streak = data.streak;
        const container = document.querySelector('.ofensiva-container');

        container.innerHTML = `
        <div style="
          position: fixed;
          top: 10px;
          right: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 9999;
        ">
          <div style="position: relative; width: 60px; height: 60px;">
            <img src="./images/foguinho.png" alt="fogo verde" style="width: 100%; height: 100%;">
            <span style="
              position: absolute;
              top: 50%;
              left: 50%;
              margin-top: 1vh;
              transform: translate(-50%, -50%);
              color: white;
              font-weight: bold;
              font-size: 20px;
              text-shadow: 0 0 4px black;
            ">
              ${streak}
            </span>
          </div>
          <span style="margin-top: 4px; font-size: 20px; font-weight: 500; color: #fff;">
            ${streak === 1 ? 'day' : 'days'}
          </span>
        </div>
      `;
      
      
    })
    .catch(error => {
        console.error('Erro ao carregar streak:', error);
    });

// links

document.getElementById('btnLogout').addEventListener('click', () => {
    localStorage.clear(); 
    window.location.href = 'index.html'; 
});


document.getElementById('linkLogo').addEventListener('click', () => {
    window.location.href = './index.html'
});






