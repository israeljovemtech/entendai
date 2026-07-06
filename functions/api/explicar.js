const MODOS_VALIDOS = [
  "criança",
  "iniciante",
  "técnico",
  "resumo",
  "exemplo prático",
];

const INSTRUCOES_POR_MODO = {
  criança: "Explique como se fosse para uma criança de 8 anos, com palavras simples. Não comece com saudação.",
  iniciante: "Explique para alguém que nunca estudou o assunto.",
  técnico: "Use uma explicação mais técnica e precisa, mas ainda clara.",
  resumo: "Faça um resumo curto, direto e fácil de lembrar.",
  "exemplo prático": "Explique usando um exemplo prático do dia a dia.",
};

export async function onRequestPost(context) {
  let body;

  try {
    body = await context.request.json();
  } catch {
    return Response.json(
      { erro: "Envie os dados em JSON válido para gerar a explicação." },
      { status: 400 }
    );
  }

  try {
    const termo = typeof body?.termo === "string" ? body.termo.trim() : "";
    const modo = normalizarModo(body?.modo);

    if (!termo) {
      return Response.json(
        { erro: "Digite uma palavra, termo ou pergunta para explicar." },
        { status: 400 }
      );
    }

    const respostaIA = await context.env.AI.run("@cf/meta/llama-3.2-3b-instruct", {
      messages: [
        {
          role: "system",
          content:
            "Você é o ENTENDAI. Responda sempre em português do Brasil, com no máximo 80 palavras. Adapte a linguagem ao modo escolhido. Seja claro, útil, não comece com saudação e termine com uma frase completa.",
        },
        {
          role: "user",
          content: `Modo escolhido: ${modo}.
Instrução do modo: ${INSTRUCOES_POR_MODO[modo]}

Explique:
${termo}`,
        },
      ],
      max_tokens: 160,
      temperature: 0.3,
    });

    const respostaBruta =
      respostaIA.response ||
      respostaIA.result ||
      respostaIA.output_text ||
      "Não consegui gerar uma explicação agora.";
    const resposta = modo === "criança" ? removerSaudacaoCrianca(respostaBruta) : respostaBruta;

    return Response.json({ resposta });
  } catch (error) {
    console.error("Erro ao explicar:", error);

    return Response.json(
      { erro: "Não consegui gerar a explicação agora. Tente novamente em instantes." },
      { status: 500 }
    );
  }
}

function normalizarModo(modo) {
  if (typeof modo !== "string") {
    return "iniciante";
  }

  const modoNormalizado = modo.trim().toLowerCase();
  return MODOS_VALIDOS.includes(modoNormalizado) ? modoNormalizado : "iniciante";
}

function removerSaudacaoCrianca(resposta) {
  return resposta.replace(/^ol[áa],?\s+menina[.!,:;-]?\s*/i, "").trim();
}
