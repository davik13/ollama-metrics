/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interaction } from '../Entities/interaction.entity';
import { CreateInteractionDto } from '../dto/create-interaction.dto';

// Service qui gère la logique métier des interactions
export class InteractionsService {
  constructor(
    // Injecte le repository pour gérer les opérations CRUD sur l'entité Interaction
    @InjectRepository(Interaction)
    private readonly interactionRepository: Repository<Interaction>,
  ) {}

  // Crée et enregistre une nouvelle interaction en base de données
  async create(
    createInteractionDto: CreateInteractionDto,
  ): Promise<Interaction> {
    // Initialise une entité Interaction avec les données reçues
    const interaction = this.interactionRepository.create(createInteractionDto);
    // Sauvegarde l'entité dans la base de données
    return this.interactionRepository.save(interaction);
  }

  // Récupère toutes les interactions
  async findAll(): Promise<Interaction[]> {
    return this.interactionRepository.find();
  }

  // Récupère quelques statistiques générales sur les interactions
  async getMetrics(): Promise<any> {
    // Nombre total d'interactions
    const total = await this.interactionRepository.count();
    // Nombre d'interactions acceptées
    const accepted = await this.interactionRepository.countBy({
      accepted: true,
    });

    // Récupère la somme des lignes suggérées (responseLines) pour toutes les interactions
    const { sum: totalLine } = await this.interactionRepository
      .createQueryBuilder()
      .select('SUM(responseLines)', 'sum')
      .getRawOne();

    // Construit un objet contenant différents indicateurs
    return {
      totalPrompts: total,
      acceptedCount: accepted,
      acceptedRate:
        total > 0 ? ((accepted / total) * 100).toFixed(2) + '%' : '0%',
      totalLinesSuggested: Number(totalLine) || 0,
    };
  }
}
