# Herman — AI Agent pessoal

Chatbot desenvolvido por **Hermínio Alfeu Manuel Jonasse Júnior** para avaliação escolar.

## O que o chatbot sabe responder

- Nome de quem o criou
- Data em que foi criado
- Dados pessoais do criador: idade, data de nascimento, telefone, morada, profissão, universidade, hobbies, etc.

Funciona **sem API paga** — as perguntas sobre o criador usam respostas locais. Opcionalmente pode ligar a API Gemini gratuita para perguntas gerais.

## Antes de publicar

1. Abra `config.js` e atualize o **telefone** e o **e-mail** com os seus dados reais.
2. Confirme a **data de criação** em `bot.dataCriacao`.
3. (Opcional) Coloque a chave Gemini em `geminiApiKey` — obtenha em https://aistudio.google.com/apikey

## Publicar e obter o link para o professor

### Opção A — GitHub Pages (recomendado, gratuito e permanente)

1. Crie uma conta em [GitHub](https://github.com) se ainda não tiver.
2. Crie um repositório novo (ex.: `chatbot-herminio-junior`).
3. Envie todos os ficheiros desta pasta para o repositório.
4. No GitHub: **Settings** → **Pages** → Source: **Deploy from branch** → Branch: `main` → Folder: `/ (root)` → **Save**.
5. Em 1–2 minutos o link ficará disponível, por exemplo:
   `https://SEU-USUARIO.github.io/chatbot-herminio-junior/`

Envie **esse link** ao professor.

### Opção B — Netlify Drop (rápido, sem Git)

1. Aceda a [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Arraste a pasta do projeto para a página.
3. Copie o link gerado (ex.: `https://nome-aleatorio.netlify.app`).

### Opção C — Jotform (conforme indicado pelo professor)

Se preferir Jotform, crie o agente na plataforma e publique apenas na última semana de aulas (trial de 30 dias).

## Testar localmente

Abra o ficheiro `index.html` no browser (duplo clique) ou use uma extensão “Live Server” no VS Code/Cursor.

## Ficheiros do projeto

| Ficheiro     | Função                                      |
|-------------|---------------------------------------------|
| `config.js` | Dados do criador e do bot (edite aqui)      |
| `script.js` | Lógica do chat e IA opcional                |
| `index.html`| Interface do chatbot                        |
| `style.css` | Visual futurista                            |

## Perguntas de teste para o professor

- "Quem te criou?"
- "Quando foste criado?"
- "Qual é o telefone do criador?"
- "Dados pessoais do criador"
- "Qual é a profissão do criador?"
