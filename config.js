/**
 * Dados do criador e do chatbot — edite aqui com a sua informação.
 * O telefone deve ser o seu número real antes de enviar ao professor.
 */
const CHATBOT_CONFIG = {
  bot: {
    nome: "Herman",
    subtitulo: "Assistente pessoal de Hermínio Júnior",
    dataCriacao: "29 de maio de 2026",
    versao: "1.0",
  },

  criador: {
    nomeCompleto: "Hermínio Alfeu Manuel Jonasse Júnior",
    nomeCurto: "Hermínio Júnior",
    dataNascimento: "10 de novembro de 2002",
    idade: 24,
    telefone: "(+258) 84 000 0000", // ← substitua pelo seu número real
    email: "herminio.junior@email.com", // opcional — substitua se quiser
    moradaNascimento: "Xai-Xai, Moçambique",
    moradaAtual: "Tete, Moçambique",
    moradaCompleta:
      "Nasceu em Xai-Xai e atualmente vive em Tete, Moçambique.",
    profissao: "Estudante",
    curso: "Engenharia Informática",
    universidade: "Instituto Superior Politécnico de Tete (ISPT)",
    hobbies: ["video games", "tecnologia", "programação"],
    interesses: [
      "inteligência artificial",
      "desenvolvimento de software",
      "inovação tecnológica",
    ],
  },

  extras: {
  /**
   * Informação extra para o chatbot saber responder.
   * Pode acrescentar frases, factos ou respostas personalizadas.
   */
    factos: [
      "Este chatbot foi desenvolvido como trabalho de AI Agent para avaliação escolar.",
      "O criador gosta de aprender novas tecnologias e criar projetos práticos.",
      "A língua principal do assistente é português.",
    ],
  },

  /**
   * Chave da API Google Gemini (opcional).
   * Deixe vazio "" para usar apenas respostas locais (funciona sem custos).
   * Obtenha em: https://aistudio.google.com/apikey
   */
  geminiApiKey: "",
};
