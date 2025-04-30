# HabitFlow

Desenvolvido por: Arthur Xavier, Laura, Gabriela e Filipe Lima

O Habitflow, ou fluxo de hábito é uma ferramenta auxiliar de cunho prático a aqueles que desejam manter controle de rotina ou de hábitos saúdaveis, buscando facilitar e gerenciar o dia-a-dia dos de forma acessível. Integra funcionalidades diversas, como: 

cadastro;
login;
logout;
criação, edição e exclusão de metas de hábitos;
contagem de dias consecutivos de conclusão de hábitos (Streaks);
notificações e lembretes;
visualização de ranking com contagem de pontos.

É composto por tecnologias FUllstack, integradas através do Frontend, Backend, e banco de dados MysqlWorkbench. Abaixo as informações necessárias para o teste de rotas e acesso a database.

# Banco de dados (MySql)

    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'HabitFlow'

# Rotas de cadastro de usuário

MÉTODO POST - /register - { "nome": "João", "email": "joao@email.com", "senha": "1234" }

MÉTODO PUT - /usuarios/editar/:id - { "nome": "João Atualizado", "email": "joao@email.com", "senha": "novaSenha" }

MÉTODO GET - /usuarios

MÉTODO GET - /usuarios/:id

MÉTODO DELETE - /usuarios/deletar/:id

# Rotas de login de usuário

MÉTODO POST - /login - { "email": "joao@email.com", "senha": "1234" }

# Rotas de hábitos

MÉTODO POST - /habitos/criar - { "usuario_id": 1, "titulo": "Beber água", "descricao": "Beber 2L por dia" }

MÉTODO GET - /habitos/:usuario_id

MÉTODO PUT - /habitos/editar/:id - { "titulo": "Novo título", "descricao": "Nova descrição" }

MÉTODO DELETE - /habitos/deletar/:id

# Rotas de progresso

MÉTODO POST - /progresso/marcar - { "usuario_id": 1, "habito_id": 3 }

MÉTODO GET - /progresso/:usuario_id

MÉTODO GET - /usuarios/:id/streak

# Rota de ranking

MÉTODO GET - /ranking







