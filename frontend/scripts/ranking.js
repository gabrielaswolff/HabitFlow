const apiUrl = 'http://localhost:3004';

async function carregarRanking() {
    try {
        const resposta = await fetch('http://localhost:3004/ranking');
        const dados = await resposta.json();

        if (dados.success) {
            const rankingDiv = document.getElementById('ranking');
            rankingDiv.innerHTML = '';

            dados.ranking.forEach((usuario, index) => {
                const item = document.createElement('div');
                item.innerHTML = `<strong>${index + 1}º</strong> - ${usuario.nome} (${usuario.pontuacao} pontos)`;

                if (index === 0) {
                    item.style.color = 'black';
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



    document.getElementById('btnLogout').addEventListener('click', () => {
        localStorage.clear(); 
        window.location.href = '/frontend/html/index.html'; 
    });
    
    
    
    
    
    