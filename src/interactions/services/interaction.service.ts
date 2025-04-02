/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interaction } from '../Entities/interaction.entity';
import { CreateInteractionDto } from '../dto/create-interaction.dto';

export class InteractionService {
  constructor(
    @InjectRepository(Interaction)
    private readonly interactionRepository: Repository<Interaction>,
  ) {}

  async create(
    createInteractionDto: CreateInteractionDto,
  ): Promise<Interaction> {
    const interaction = this.interactionRepository.create(createInteractionDto);
    return this.interactionRepository.save(interaction);
  }

  async findAll(): Promise<Interaction[]> {
    return this.interactionRepository.find();
  }

  async getMetrics(): Promise<any> {
    const total = await this.interactionRepository.count();
    const accepted = await this.interactionRepository.countBy({
      accepted: true,
    });

    const { sum: totalLine } = await this.interactionRepository
      .createQueryBuilder()
      .select('SUM(responseLines)', 'sum')
      .getRawOne();

    return {
      totalPrompts: total,
      acceptedCount: accepted,
      acceptedRate:
        total > 0 ? ((accepted / total) * 100).toFixed(2) + '%' : '0%',
      totalLinesSuggested: Number(totalLine) || 0,
    };
  }
}
