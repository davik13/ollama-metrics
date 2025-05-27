/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProxyService {
  // URL de l'API Ollama et du backend pour les interactions
  private readonly OLLAMA_URL = 'http://localhost:11434';
  private readonly BACKEND_URL = 'http://localhost:3000/interactions';

  // Méthode pour transférer les requêtes vers l'API Ollama
  async forwardToOllama(body: any) {
    console.log('Requête reçue depuis Continue');

    const start = Date.now();

    // gerer modele "AUTODETECT"
    const model = body.model === 'AUTODETECT' ? 'mistral' : body.model;

    // Utilise le champ "messages" si disponible, sinon crée un prompt à partir du body
    const messages = body.messages || [
      {
        role: 'user',
        content: body.prompt || '',
      },
    ];
    try {
       // Effectue l’appel POST vers Ollama
      const ollamaRes = await axios.post(`${this.OLLAMA_URL}/api/chat`, {
        model,
        messages,
        stream: false,
      });

      const data = ollamaRes.data;
      const end = Date.now();

      // Extrait le texte de la réponse et calcule le nombre de lignes
      const responsetext = data?.message?.content || '';
      const promptText = messages.map((m: any) => m.content).join('\n');

      const responseLines =
        typeof responsetext === 'string' && responsetext.trim() !== ''
          ? responsetext.trim().split('\n').length
          : 0;

      // Enregistre l’interaction via le backend
      await axios.post(this.BACKEND_URL, {
        userId: 'continue_user',
        prompt: promptText,
        response: responsetext,
        accepted: true,
        responseLines,
        responseTimeMs: data.total_duration
          ? Math.round(data.total_duration / 1_000_000)
          : end - start,
        tokensPrompt: data.prompt_eval_count ?? null,
        tokensResponse: data.eval_count ?? null,
        evalDuration: data.eval_duration
          ? Math.round(data.eval_duration / 1_000_000)
          : null,
        modelUsed: data.model ?? model,
      });

      // Affiche quelques informations utiles dans la console
      console.table({
        model: model,
        tokensPrompt: data.prompt_eval_count,
        tokensResponse: data.eval_count,
        durationMs: Math.round(data.total_duration / 1_000_000),
        lines: responseLines,
      });
 
      // Retourne la réponse de l'API Ollama
      return data;
    } catch (err: any) {
      // Gère l’erreur et renvoie une exception HTTP 500
      console.error(
        'Erreur proxy -> Ollama:',
        err?.response?.data || err.message,
      );
      throw new InternalServerErrorException(
        'Erreur lors de la communication avec Ollama.',
      );
    }
  }
}
