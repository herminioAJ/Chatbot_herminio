const { bot, criador, extras, geminiApiKey } = CHATBOT_CONFIG;

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function containsAny(text, keywords) {
  return keywords.some((k) => text.includes(k));
}

function formatLista(items) {
  return items.map((item) => `• ${item}`).join("\n");
}

function respostaLocal(mensagem) {
  const t = normalize(mensagem);

  if (
    containsAny(t, [
      "quem te criou",
      "quem criou",
      "nome do criador",
      "teu criador",
      "seu criador",
      "quem e o criador",
      "quem e teu criador",
    ])
  ) {
    return `Fui criado por ${criador.nomeCompleto}, também conhecido como ${criador.nomeCurto}.`;
  }

  if (
    containsAny(t, [
      "quando foste criado",
      "quando foi criado",
      "data de criacao",
      "data que foste criado",
      "quando nasceste tu",
      "quando existes",
    ]) &&
    !containsAny(t, ["nascimento", "nasceu", "nasceste"])
  ) {
    return `Fui criado em ${bot.dataCriacao}.`;
  }

  if (containsAny(t, ["como te chamas", "qual e o teu nome", "quem es tu", "o teu nome"])) {
    return `Chamo-me ${bot.nome}. Sou o assistente pessoal de ${criador.nomeCurto}.`;
  }

  if (containsAny(t, ["data de nascimento", "quando nasceu", "nasceu o criador", "nascimento"])) {
    return `O meu criador nasceu a ${criador.dataNascimento}.`;
  }

  if (containsAny(t, ["idade", "quantos anos", "anos tem"])) {
    return `${criador.nomeCurto} tem ${criador.idade} anos.`;
  }

  if (containsAny(t, ["telefone", "telemovel", "celular", "contacto", "numero"])) {
    return `O telefone de contacto é: ${criador.telefone}.`;
  }

  if (containsAny(t, ["email", "e-mail", "correio"])) {
    return criador.email
      ? `O e-mail de contacto é: ${criador.email}.`
      : "Não tenho e-mail registado na minha base de dados.";
  }

  if (containsAny(t, ["morada", "onde vive", "onde mora", "endereco", "reside"])) {
    return `Morada: ${criador.moradaCompleta}`;
  }

  if (containsAny(t, ["profissao", "trabalha", "ocupacao", "o que faz"])) {
    return `${criador.nomeCurto} é ${criador.profissao} do curso de ${criador.curso} na ${criador.universidade}.`;
  }

  if (containsAny(t, ["universidade", "escola", "faculdade", "ispt", "instituto"])) {
    return `Estuda no ${criador.universidade}, no curso de ${criador.curso}.`;
  }

  if (containsAny(t, ["hobby", "hobbies", "gosta de", "passatempo"])) {
    return `Os hobbies do criador incluem: ${criador.hobbies.join(", ")}.`;
  }

  if (containsAny(t, ["dados pessoais", "tudo sobre", "informacao completa", "informacoes do criador"])) {
    return `Dados do criador:

• Nome: ${criador.nomeCompleto}
• Data de nascimento: ${criador.dataNascimento}
• Idade: ${criador.idade} anos
• Telefone: ${criador.telefone}
• Morada: ${criador.moradaCompleta}
• Profissão: ${criador.profissao} (${criador.curso})
• Universidade: ${criador.universidade}
• Hobbies: ${criador.hobbies.join(", ")}

Data em que fui criado: ${bot.dataCriacao}.`;
  }

  if (containsAny(t, ["ola", "oi", "bom dia", "boa tarde", "boa noite", "hey"])) {
    return `Olá! Sou o ${bot.nome}, assistente de ${criador.nomeCurto}. Pergunte sobre o criador, a data em que fui criado, ou qualquer outro tema.`;
  }

  if (containsAny(t, ["ajuda", "help", "o que sabes", "o que podes"])) {
    return `Posso responder sobre:
• Quem me criou
• Data em que fui criado (${bot.dataCriacao})
• Dados pessoais do criador (idade, telefone, morada, profissão, etc.)

Experimente perguntar, por exemplo: "Qual é o telefone do criador?" ou "Dados pessoais do criador".`;
  }

  if (containsAny(t, ["factos", "curiosidades", "mais informacao"])) {
    return formatLista(extras.factos);
  }

  return null;
}

function buildGeminiContext() {
  return `
Você é ${bot.nome}, um assistente virtual amigável e profissional em português.

Dados obrigatórios (use sempre que perguntarem):
- Criador: ${criador.nomeCompleto}
- Data de criação do chatbot: ${bot.dataCriacao}
- Data de nascimento do criador: ${criador.dataNascimento}
- Idade: ${criador.idade} anos
- Telefone: ${criador.telefone}
- Morada: ${criador.moradaCompleta}
- Profissão: ${criador.profissao}, curso de ${criador.curso}
- Universidade: ${criador.universidade}
- Hobbies: ${criador.hobbies.join(", ")}

Factos extra: ${extras.factos.join(" ")}

Seja claro, educado e responda em português de Moçambique/Portugal.
`.trim();
}

async function askGemini(message) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: `${buildGeminiContext()}\n\nPergunta do utilizador: ${message}` }],
        },
      ],
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.candidates[0].content.parts[0].text;
}

async function askWikipedia(message) {
  // Pesquisa simples na Wikipédia (PT, e se falhar EN) — sem API key + CORS (origin=*)
  const tryLang = async (lang) => {
    const searchUrl =
      `https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
        message
      )}&limit=1&namespace=0&format=json&origin=*`;

    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const titles = searchData?.[1];

    const title = Array.isArray(titles) && titles.length ? titles[0] : null;
    if (!title) return null;

    const summaryUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      title
    )}`;
    const summaryRes = await fetch(summaryUrl);
    const summaryData = await summaryRes.json();

    const extract = summaryData?.extract;
    const pageUrl = summaryData?.content_urls?.desktop?.page;

    if (!extract) return null;

    const label = lang === "pt" ? "Wikipédia" : "Wikipedia";
    return `Pesquisa (${label}): ${title}\n\n${extract}${
      pageUrl ? `\n\nFonte: ${pageUrl}` : ""
    }`;
  };

  return (await tryLang("pt")) || (await tryLang("en"));
}

async function askWikidata(message) {
  // Factos/definições no Wikidata (sem API key; CORS permitido)
  const searchUrl =
    `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(
      message
    )}&language=pt&uselang=pt&limit=1&format=json&origin=*`;

  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();
  const hit = Array.isArray(searchData?.search) ? searchData.search[0] : null;
  if (!hit?.id) return null;

  const entityUrl = `https://www.wikidata.org/wiki/Special:EntityData/${hit.id}.json`;
  const entityRes = await fetch(entityUrl);
  const entityData = await entityRes.json();
  const entity = entityData?.entities?.[hit.id];
  if (!entity) return null;

  const label =
    entity?.labels?.pt?.value ||
    entity?.labels?.en?.value ||
    hit.label ||
    message;
  const description = entity?.descriptions?.pt?.value || hit.description || "";

  const wikipediaPt = entity?.sitelinks?.ptwiki?.url;
  const wikidataPage = `https://www.wikidata.org/wiki/${hit.id}`;

  // Extrai alguns factos comuns, se existirem (datas/locais dependem do item)
  const claims = entity.claims || {};
  const factLines = [];

  const pickTime = (prop) => {
    const snak = claims?.[prop]?.[0]?.mainsnak?.datavalue?.value;
    const time = snak?.time;
    if (!time) return null;
    // Ex.: "+2002-11-10T00:00:00Z"
    return time.replace(/^\+/, "").slice(0, 10);
  };

  const pickEntityId = (prop) =>
    claims?.[prop]?.[0]?.mainsnak?.datavalue?.value?.id || null;

  const fetchLabel = async (qid) => {
    if (!qid) return null;
    const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}&props=labels&languages=pt|en&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    const ent = data?.entities?.[qid];
    return ent?.labels?.pt?.value || ent?.labels?.en?.value || null;
  };

  const birth = pickTime("P569"); // data de nascimento
  const death = pickTime("P570"); // data de falecimento
  const countryQ = pickEntityId("P17"); // país
  const occupationQ = pickEntityId("P106"); // profissão/ocupação

  if (birth) factLines.push(`• Nascimento: ${birth}`);
  if (death) factLines.push(`• Falecimento: ${death}`);

  // Buscar labels extra (em paralelo)
  const [country, occupation] = await Promise.all([
    fetchLabel(countryQ),
    fetchLabel(occupationQ),
  ]);
  if (country) factLines.push(`• País: ${country}`);
  if (occupation) factLines.push(`• Ocupação: ${occupation}`);

  const factsBlock = factLines.length ? `\n\nAlguns factos:\n${factLines.join("\n")}` : "";

  return `Pesquisa (Wikidata): ${label}${description ? ` — ${description}` : ""}${factsBlock}\n\nFonte: ${
    wikipediaPt || wikidataPage
  }`;
}

async function askOpenAlex(message) {
  // Pesquisa académica gratuita (artigos/temas) via OpenAlex
  const url = `https://api.openalex.org/works?search=${encodeURIComponent(
    message
  )}&per-page=1`;
  const res = await fetch(url);
  const data = await res.json();
  const work = Array.isArray(data?.results) ? data.results[0] : null;
  if (!work) return null;

  const title = work?.title;
  const year = work?.publication_year;
  const doi = work?.doi;
  const host = work?.primary_location?.source?.display_name;
  const landing = work?.primary_location?.landing_page_url;

  if (!title) return null;

  const parts = [
    `Pesquisa (OpenAlex): ${title}${year ? ` (${year})` : ""}`,
    host ? `\nPublicado em: ${host}` : "",
    doi ? `\nDOI: ${doi}` : "",
    `\nFonte: ${landing || work?.id}`,
  ].filter(Boolean);

  return parts.join("");
}

function appendMessage(text, className) {
  const chatBox = document.getElementById("chat-box");
  const el = document.createElement("div");
  el.className = className;
  el.innerText = text;
  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
  return el;
}

function showTyping() {
  const el = appendMessage(`${bot.nome} está a escrever...`, "typing");
  return () => el.remove();
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  appendMessage(message, "user-message");
  input.value = "";

  const removeTyping = showTyping();

  try {
    const local = respostaLocal(message);
    if (local) {
      await delay(400);
      removeTyping();
      appendMessage(local, "bot-message");
      return;
    }

    if (!geminiApiKey) {
      // Sem chave Gemini: tenta pesquisa gratuita (Wikipédia) para perguntas gerais.
      const wiki = await askWikipedia(message);
      if (wiki) {
        removeTyping();
        appendMessage(wiki, "bot-message");
        return;
      }
      const wikidata = await askWikidata(message);
      if (wikidata) {
        removeTyping();
        appendMessage(wikidata, "bot-message");
        return;
      }
      // OpenAlex pode ajudar mesmo sem palavras-chave “académicas”
      const openalex = await askOpenAlex(message);
      if (openalex) {
        removeTyping();
        appendMessage(openalex, "bot-message");
        return;
      }
      removeTyping();
      appendMessage(
        `Não consegui encontrar uma resposta de pesquisa para isso agora.\n\nPode tentar reformular a pergunta (mais curta e específica) ou dar mais contexto.\n\nExemplos que normalmente funcionam:\n• \"O que é inteligência artificial?\"\n• \"Quem foi Alan Turing?\"\n• \"Explica blockchain em 3 linhas\"\n\nE claro, posso sempre responder sobre o criador: \"Dados pessoais do criador\".`,
        "bot-message"
      );
      return;
    }

    const resposta = await askGemini(message);
    removeTyping();
    appendMessage(resposta, "bot-message");
  } catch (error) {
    removeTyping();
    console.error(error);
    appendMessage(
      "Ocorreu um erro ao ligar à IA. As perguntas sobre o criador funcionam na mesma — tente por exemplo: \"Quem te criou?\".",
      "bot-message"
    );
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sendSuggestion(text) {
  document.getElementById("user-input").value = text;
  sendMessage();
}

document.getElementById("user-input").addEventListener("keypress", (event) => {
  if (event.key === "Enter") sendMessage();
});

// Expor para onclick no HTML
window.sendMessage = sendMessage;
window.sendSuggestion = sendSuggestion;
