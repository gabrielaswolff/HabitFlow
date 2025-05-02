const apiUrl = 'http://localhost:3004';

// Mostrar Notificações
function mostrarNotificacao(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.classList.add('notificacao');
    notificacao.innerText = mensagem;

    document.getElementById('notificacaoContainer').appendChild(notificacao);

    setTimeout(() => {
        notificacao.remove();
    }, 4000);
}

// Cadastro de Usuário
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('emailCadastro').value;
    const senha = document.getElementById('senhaCadastro').value;

    try {
        // Cadastra o usuário
        const response = await fetch(`${apiUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.json();
        mostrarNotificacao(data.message);

        if (response.ok) {
            // Após cadastro, faz login automático
            const loginResponse = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const loginData = await loginResponse.json();
            if (loginData.success) {
                mostrarNotificacao('Bem-vindo(a), ' + loginData.user.nome + '!');
                localStorage.setItem('userId', loginData.user.id);
                mostrarBotaoLogout();

                // Aguarda 3 segundos antes de redirecionar
                setTimeout(() => {
                    window.location.href = '/frontend/html/painel.html';
                }, 1000);
            }
        }
    } catch (error) {
        console.error('Erro ao cadastrar e logar:', error);
    }
});

// Login de Usuário
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
            mostrarNotificacao('Bem-vindo(a), ' + data.user.nome + '!');
            localStorage.setItem('userId', data.user.id);
            mostrarBotaoLogout();

            setTimeout(() => {
                window.location.href = '/frontend/html/painel.html';
            }, 1000);
        } else {
            mostrarNotificacao(data.message);
        }
    } catch (error) {
        console.error('Erro no login:', error);
    }
});




// Mensagens Motivacionais
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
    painelMensagem.classList.add('show');
    painelMensagem.style.display = 'block';

    setTimeout(() => {
        painelMensagem.classList.remove('show');
        painelMensagem.style.display = 'none';
    }, 3000);
}

setInterval(exibirMensagemMotivacional, 10000);

// Exibir Ofensiva (Streak)
const userId = localStorage.getItem('userId');
if (userId) {
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
                        <img src="/frontend/images/foguinho.png" alt="fogo verde" style="width: 100%; height: 100%;">
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
                        ">${streak}</span>
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
}

// Botão de Logout
function mostrarBotaoLogout() {
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.style.display = 'block';
    }
}

function esconderBotaoLogout() {
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.style.display = 'none';
    }
}

document.getElementById('btnLogout').addEventListener('click', () => {
    localStorage.clear();
    esconderBotaoLogout();
    window.location.href = '/frontend/html/index.html';
});




// Exibe ou esconde botão "Sair" com base no login
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userId')) {
        mostrarBotaoLogout();
    } else {
        esconderBotaoLogout();
    }
});

