import { ollama } from 'ollama-ai-provider';
import { convertToCoreMessages, streamText } from "ai";
import { NextResponse } from "next/server";
import { kv } from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';

const rateLimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(2,'60s')
})

export async function POST(request) {
  try {

    const ip = request.ip ?? 'ip';
    const { success, remaining } = await rateLimit.limit(ip);

    if(!success) {
      return new Response('Limite de mensagem atingido!', { status: 429 })
    }

    const { messages } = await request.json();

    const result = await streamText({
      model: ollama("llama3.1"),
      messages: convertToCoreMessages(messages),
      system: `
        Você é um assistente pessoal divertido e gentil que fala sobre filmes.
        Se alguém te perguntar qualquer coisa que não seja sobre filmes, 
        responda de forma divertida que você só sabe falar sobre filmes e ofereça seus serviços.
      `,
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        if(error == null) {
          console.error('[POST] :: toDataStreamResponse - Erro chegou nulo ')
          return "Algum erro inesperado aconteceu!"
        }
        if(typeof error == "string") {
          return error;
        }
        return JSON.stringify(error);
      }
    });
  } catch (error) {
    console.error("Erro ao conectar com a OpenAI:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Erro desconhecido ao conectar com a OpenAI. Verifique sua chave ou crédito.",
      },
      { status: error?.status || 500 }
    );
  }
}