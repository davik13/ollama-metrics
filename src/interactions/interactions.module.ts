import { Module } from '@nestjs/common';
import { InteractionsService } from './services/interaction.service';
import { InteractionController } from './controllers/interaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interaction } from './Entities/interaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interaction])],
  providers: [InteractionsService],
  controllers: [InteractionController],
})
export class InteractionsModule {}
