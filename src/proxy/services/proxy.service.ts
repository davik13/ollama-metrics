/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProxyService {
  private readonly OLLAMA_URL = 'http://localhost:11434';
  private readonly BACKEND_URL = 'http://localhost:3000/interactions';

  async forwardToOllama(body: any) {
    console.log('🔥 Requête reçue depuis Continue');

    const start = Date.now();

    // gerer modele "AUTODETECT"
    const model = body.model === 'AUTODETECT' ? 'mistral' : body.model;

    // utiliser le "messages" si dispo , sion fallback à prompt simple
    const messages = body.messages || [
      {
        role: 'user',
        content: body.prompt || '',
      },
    ];
    try {
      const ollamaRes = await axios.post(
        `${this.OLLAMA_URL}/api/chat`, {
          model,
          messages,
          stream: false,
        });

        const data = ollamaRes.data;
        const end = Date.now();

        const responsetext = data?.message?.content || '';
        const promptText = messages.map((m: any) => m.content).join('\n');

        const responseLines = typeof responsetext === 'string' && responsetext.trim() !== '' ? responsetext.trim().split('\n').length : 0;

        await axios.post(this.BACKEND_URL, {
          userId: 'continue_user',
          prompt: promptText,
          response: responsetext,
          accepted: true,
          responseLines,
          responseTimeMs: data.total_duration ? Math.round(data.total_duration / 1_000_000) : end - start,
          tokensPrompt: data.prompt_eval_count ?? null,
          tokensResponse: data.eval_count ?? null,
          evalDuration: data.eval_duration ? Math.round(data.eval_duration / 1_000_000) : null,
          modelUsed: data.model ?? model,
        });

        console.table({
          model: model,
          tokensPrompt: data.prompt_eval_count,
          tokensResponse: data.eval_count,
          durationMs: Math.round(data.total_duration / 1_000_000),
          lines: responseLines,
        });
        return  data;
    } catch (err: any) {
      console.error(
        'Erreur proxy → Ollama:',
        err?.response?.data || err.message,
      );
      throw new InternalServerErrorException(
        'Erreur lors de la communication avec Ollama.',
      );
    }

    //   const data = response.data;
    //   const end = Date.now();
    //   let responseLines = 0;

    //   if (typeof data.response === 'string') {
    //     const trimmed = data.response.trim();
    //     responseLines = trimmed === '' ? 0 : trimmed.split('\n').length;
    //   }
      
    //   responseLines = Math.floor(responseLines); // <-- sécurité en plus
    //   let evalDuration: number| null = null;
    //     if (data.eval_duration && typeof data.eval_duration === 'number') {
    //         evalDuration = Math.round(data.eval_duration / 1_000_000); // ns → ms
    //     }

    //   await axios.post(this.BACKEND_URL, {
    //     userId: 'continue_user',
    //     prompt,
    //     response: data.response,
    //     accepted: true,
    //     responseLines,
    //     responseTimeMs: data.total_duration
    //       ? data.total_duration / 1_000_000
    //       : end - start,
    //     tokensPrompt: data.prompt_eval_count,
    //     tokensResponse: data.eval_count,
    //     modelUsed: data.model,
    //     evalDuration,
    //   });

    //   return data;
    // } catch (err: any) {
    //   console.error(
    //     'Erreur proxy → Ollama:',
    //     err?.response?.data || err.message,
    //   );
    //   throw new InternalServerErrorException(
    //     'Erreur lors de la communication avec Ollama.',
    //   );
    // }
  }
}
