import { Module } from '@nestjs/common';
import { InteractionService } from './services/interaction.service';
import { InteractionController } from './controllers/interaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interaction } from './Entities/interaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interaction])],
  providers: [InteractionService],
  controllers: [InteractionController],
})
export class InteractionsModule  {}
