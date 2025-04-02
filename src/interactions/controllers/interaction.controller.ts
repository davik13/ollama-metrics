import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateInteractionDto } from '../dto/create-interaction.dto';
import { InteractionService } from '../services/interaction.service';

// Déclaration du contrôleur pour gérer les routes liées aux interactions
@Controller('interactions')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  // Route POST pour créer une nouvelle interaction
  @Post()
  createInteraction(@Body() createInteractionDto: CreateInteractionDto) {
    return this.interactionService.create(createInteractionDto);
  }
  // Route GET pour récupérer toutes les interactions
  @Get()
  getAllInteractions() {
    return this.interactionService.findAll();
  }
    // Route GET pour récupérer les métriques des interactions
  @Get('metrics')
  getMetrics() {
    return this.interactionService.getMetrics();
  }
}
