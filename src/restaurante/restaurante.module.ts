import { Module } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';

@Module({
  providers: [RestauranteService]
})
export class RestauranteModule {}
