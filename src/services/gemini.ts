import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = 'gemini-3-flash-preview';

export async function generateDailyDevotional() {
  const prompt = `Crie um devocional diário inspirador em português. 
  Inclua:
  1. Um versículo bíblico chave.
  2. Uma reflexão profunda, mas acessível sobre o versículo (2-3 parágrafos).
  3. Uma aplicação prática para o dia de hoje.
  4. Uma breve oração final.
  Formate a resposta em Markdown.`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: "Você é um pastor e teólogo experiente, sábio e encorajador, focado em ajudar as pessoas a se conectarem com Deus diariamente.",
    }
  });

  return response.text;
}

export async function generateSermon(theme: string) {
  const prompt = `Crie um estudo bíblico completo e um esboço de pregação sobre o tema: "${theme}".
  Inclua:
  1. **Contexto Histórico e Cultural**: Explique o pano de fundo do tema na Bíblia.
  2. **Esboço da Pregação**: Um esboço claro com Introdução, 3 a 4 pontos principais (com referências bíblicas) e Conclusão.
  3. **Versículos Relacionados**: Uma lista de 5 a 7 versículos que se conectam profundamente com o tema.
  4. **Mensagem para Compartilhar**: Um pequeno texto inspirador (estilo tweet/status) resumindo a mensagem, pronto para compartilhar nas redes sociais.
  Formate a resposta em Markdown.`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: "Você é um teólogo erudito e um pregador apaixonado. Seu objetivo é fornecer material teologicamente sólido, historicamente preciso e espiritualmente edificante.",
    }
  });

  return response.text;
}

export async function explainText(text: string) {
  const prompt = `Explique detalhadamente a seguinte passagem ou versículo bíblico: "${text}".
  Inclua:
  1. **Significado Original**: O que o texto significava para os ouvintes originais (contexto imediato).
  2. **Análise de Palavras-Chave**: Destaque 1 ou 2 palavras importantes no original (hebraico/grego) e seus significados.
  3. **Interpretação Teológica**: Como esse texto se encaixa na grande narrativa da Bíblia.
  4. **Aplicação Prática**: Como podemos aplicar esse texto em nossas vidas hoje.
  Formate a resposta em Markdown.`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: "Você é um exegeta bíblico detalhista e um professor claro. Você explica textos complexos de forma simples, sem perder a profundidade teológica.",
    }
  });

  return response.text;
}

export async function generatePrayer(situation: string) {
  const prompt = `Escreva uma oração sincera, reconfortante e baseada na Bíblia para a seguinte situação: "${situation}".
  A oração deve ser em primeira pessoa (como se eu estivesse orando), demonstrar fé, buscar a vontade de Deus e trazer paz. Inclua uma referência bíblica no final que embase a oração.
  Formate a resposta em Markdown.`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: "Você é um intercessor compassivo e cheio de fé, que sabe usar as palavras das Escrituras para trazer consolo e esperança em oração.",
    }
  });

  return response.text;
}
