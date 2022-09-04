import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturaService } from '../cultura/cultura.service';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaEntity,RestauranteEntity])],
  providers: [CulturaService]
})
export class CulturaRestauranteModule {}
