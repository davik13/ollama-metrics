import { Body, Controller, Post, Res } from '@nestjs/common';
import { ProxyService } from '../services/proxy.service';
import { Response } from 'express';

@Controller('api')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  /**
   * Route pour gérer les requêtes de chat
   * @param body - Le corps de la requête contenant les données du chat
   * @param res - L'objet de réponse Express
   */
  @Post('chat')
  async chat(@Body() body: any, @Res() res: Response) {
    const result = await this.proxyService.forwardToOllama(body);
    res.json(result);
  }
}
