import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturaRestauranteController } from './cultura-restaurante.controller';
import { CulturaRestauranteService } from './cultura-restaurante.service';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaEntity,RestauranteEntity])],
  providers: [CulturaRestauranteService],
  controllers: [CulturaRestauranteController]
})
export class CulturaRestauranteModule {}
