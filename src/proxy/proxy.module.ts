import { Module } from '@nestjs/common';
import { ProxyService } from './services/proxy.service';
import { ProxyController } from './controllers/proxy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interaction } from 'src/interactions/Entities/interaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interaction])],
  providers: [ProxyService],
  controllers: [ProxyController],
})
export class ProxyModule {}
